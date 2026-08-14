import { createClient, type SupabaseClient } from "npm:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const FROM_EMAIL = Deno.env.get("FROM_EMAIL")!;
const MAX_LEADS = 25;
const MAX_PARTNERS = 10;
const ALLOWED_ORIGINS = new Set(
  (Deno.env.get("ALLOWED_ADMIN_ORIGINS") ||
    "https://admin.luxlanding.eu,https://luxlanding-migration-platform-staging.macarthurjeanpierre.workers.dev,http://localhost:4173,http://localhost:4174,http://localhost:4175")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
);

class RequestError extends Error {
  constructor(message: string, readonly status = 400) {
    super(message);
  }
}

function corsHeaders(origin: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }
  return headers;
}

function json(body: unknown, status: number, origin: string | null): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders(origin),
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}

function text(value: unknown, max = 500): string {
  return String(value ?? "").replace(/[\u0000-\u001f\u007f]/g, " ").trim()
    .slice(0, max);
}

function escapeHtml(value: unknown): string {
  return text(value, 4000)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function parseIds(value: unknown, field: string, max: number): string[] {
  if (!Array.isArray(value) || value.length < 1 || value.length > max) {
    throw new RequestError(`${field} must contain between 1 and ${max} IDs.`);
  }
  const ids = [...new Set(value.map((item) => text(item, 100)))];
  if (ids.some((id) => !/^[A-Za-z0-9_-]{3,100}$/.test(id))) {
    throw new RequestError(`${field} contains an invalid ID.`);
  }
  return ids;
}

function parseRequestId(value: unknown): string {
  const requestId = text(value, 36).toLowerCase();
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
      .test(requestId)
  ) {
    throw new RequestError("requestId must be a valid UUID.");
  }
  return requestId;
}

function isAdmin(user: { app_metadata?: Record<string, unknown> }): boolean {
  const metadata = user.app_metadata || {};
  return metadata.role === "admin" ||
    (Array.isArray(metadata.roles) && metadata.roles.includes("admin"));
}

type ReferralCategory = "housing" | "admin" | "schools" | "health" | "banking" | "moving" | "language" | "job" | "freelancer" | "other";
type ReferralScope = "contact" | "summary" | "housing" | "admin" | "schools" | "health" | "banking" | "moving" | "language" | "job" | "freelancer" | "notes";
const ALLOWED_REFERRAL_SCOPES = new Set<ReferralScope>([
  "contact", "summary", "housing", "admin", "schools", "health", "banking",
  "moving", "language", "job", "freelancer", "notes",
]);

const PARTNER_CATEGORY_TERMS: Record<ReferralCategory, string[]> = {
  housing: ["housing", "property", "real estate", "relocation"],
  admin: ["admin", "paperwork", "immigration", "residence", "visa"],
  schools: ["family", "school", "childcare", "education"],
  health: ["health", "insurance", "cns"],
  banking: ["banking", "bank", "finance"],
  moving: ["moving", "removal", "logistics"],
  language: ["language", "training", "course"],
  job: ["job", "career", "recruit", "cv"],
  freelancer: ["freelance", "business", "tax", "accounting"],
  other: ["other", "general"],
};

function getPartnerCategories(partner: Record<string, unknown>): Set<ReferralCategory> {
  const descriptor = `${text(partner.group, 300)} ${text(partner.services, 500)}`.toLowerCase();
  const categories = new Set<ReferralCategory>();
  for (const [category, terms] of Object.entries(PARTNER_CATEGORY_TERMS) as Array<[ReferralCategory, string[]]>) {
    if (terms.some((term) => descriptor.includes(term))) categories.add(category);
  }
  if (/\b(law|lawyer|legal|attorney|avocat|abogado)\b/.test(descriptor)) {
    categories.add("admin");
    categories.add("freelancer");
  }
  return categories;
}

function getDefaultPartnerScopes(partner: Record<string, unknown>): Set<ReferralScope> {
  const scopes = new Set<ReferralScope>(["contact", "summary"]);
  const categories = getPartnerCategories(partner);
  for (const category of categories) {
    if (category === "other") scopes.add("notes");
    else scopes.add(category);
  }
  return scopes;
}

function parsePartnerScopes(
  value: unknown,
  partners: Record<string, unknown>[],
): Map<string, Set<ReferralScope>> {
  const input = value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
  const result = new Map<string, Set<ReferralScope>>();
  for (const partner of partners) {
    const partnerId = text(partner.partner_id, 100);
    const requested = input[partnerId];
    if (requested === undefined) {
      result.set(partnerId, getDefaultPartnerScopes(partner));
      continue;
    }
    if (!Array.isArray(requested) || requested.length > ALLOWED_REFERRAL_SCOPES.size) {
      throw new RequestError("Invalid partner information selection.");
    }
    const scopes = new Set<ReferralScope>();
    for (const rawScope of requested) {
      const scope = text(rawScope, 30) as ReferralScope;
      if (!ALLOWED_REFERRAL_SCOPES.has(scope)) {
        throw new RequestError("Invalid partner information selection.");
      }
      scopes.add(scope);
    }
    result.set(partnerId, scopes);
  }
  return result;
}

function filteredNeeds(lead: Record<string, unknown>, categories: Set<ReferralCategory>): string {
  return text(lead.needs, 500).split(/[\s,]+/).map((need) => need.trim().toLowerCase())
    .filter((need) => categories.has(need as ReferralCategory)).join(", ");
}

function leadRows(
  lead: Record<string, unknown>,
  scopes: Set<ReferralScope>,
): string {
  const categories = new Set<ReferralCategory>();
  for (const scope of scopes) {
    if (scope !== "contact" && scope !== "summary" && scope !== "notes") {
      categories.add(scope);
    }
  }
  const rows: Array<[string, unknown]> = [
    ["Lead ID", lead.lead_id],
  ];

  if (scopes.has("contact")) rows.push(
    ["Name", lead.contact_name],
    ["Email", lead.contact_email],
    ["Phone", lead.contact_phone],
    ["Preferred contact", lead.contact_method],
    ["Best contact time", lead.contact_time],
  );

  if (scopes.has("summary")) rows.push(
    ["Profile", lead.profile],
    ["Relevant needs", filteredNeeds(lead, categories)],
    ["Move timing", lead.move_timing],
    ["Support readiness", lead.support_readiness],
  );

  if (categories.has("housing")) rows.push(
    ["Monthly housing budget", lead.housing_budget],
    ["Bedrooms needed", lead.housing_bedrooms],
    ["Has work contract", lead.housing_contract],
  );
  if (categories.has("schools")) rows.push(
    ["Number of children", lead.schools_children_count],
    ["Children ages", lead.schools_children_ages],
    ["School preference", lead.schools_type],
  );
  if (categories.has("admin")) rows.push(
    ["Has job contract", lead.admin_job_contract],
    ["Has Luxembourg address", lead.admin_address],
  );
  if (categories.has("health")) rows.push(
    ["Needs provider guidance", lead.health_provider],
    ["Registered with CNS", lead.health_cns],
  );
  if (categories.has("banking")) rows.push(
    ["Needs bank account help", lead.bank_account],
    ["Employed in Luxembourg", lead.bank_employed],
  );
  if (categories.has("moving")) rows.push(
    ["Needs moving-company help", lead.moving_help],
    ["Moving from", lead.moving_country],
  );
  if (categories.has("language")) rows.push(
    ["Target language", lead.language_target],
    ["Current language level", lead.language_level],
  );
  if (categories.has("job")) rows.push(
    ["Needs CV help", lead.job_cv_help],
    ["Needs interview preparation", lead.job_interview],
  );
  if (categories.has("freelancer")) rows.push(
    ["Needs business registration help", lead.freelancer_register],
    ["Needs tax guidance", lead.freelancer_tax],
  );
  if (scopes.has("notes")) rows.push(
    ["Other need", lead.needs_other],
    ["Situation notes", lead.situation_notes],
  );
  return rows.filter(([, value]) => text(value)).map(([label, value]) => `
    <tr>
      <td style="padding:6px 14px 6px 0;color:#667085;vertical-align:top;">${
    escapeHtml(label)
  }</td>
      <td style="padding:6px 0;color:#121826;font-weight:600;">${
    escapeHtml(value)
  }</td>
    </tr>`).join("");
}

function buildEmail(
  partner: Record<string, unknown>,
  leads: Record<string, unknown>[],
  scopes: Set<ReferralScope>,
): string {
  const partnerName = text(partner.name || partner.company) || "Partner";
  const leadSections = leads.map((lead) => `
    <div style="margin-top:22px;padding-top:18px;border-top:1px solid #e8eef7;">
      <table style="width:100%;border-collapse:collapse;font-size:14px;">${
    leadRows(lead, scopes)
  }</table>
    </div>`).join("");

  return `<!doctype html>
  <html><body style="margin:0;background:#f4f7fb;font-family:Arial,sans-serif;color:#121826;">
    <div style="max-width:680px;margin:0 auto;padding:28px 16px;">
      <div style="background:#111827;color:#fff;padding:24px 28px;border-radius:14px 14px 0 0;">
        <div style="font-size:21px;font-weight:700;">LuxLanding</div>
        <div style="margin-top:4px;color:#cbd5e1;font-size:13px;">Secure partner referral</div>
      </div>
      <div style="background:#fff;padding:28px;border-radius:0 0 14px 14px;">
        <p style="margin-top:0;">Hello ${escapeHtml(partnerName)},</p>
        <p>LuxLanding has assigned ${leads.length} relocation lead${
    leads.length === 1 ? "" : "s"
  } for your review.</p>
        ${leadSections}
        <p style="margin:24px 0 0;color:#667085;font-size:12px;">These details are confidential and must only be used to respond to this referral.</p>
      </div>
    </div>
  </body></html>`;
}

Deno.serve(async (request) => {
  const origin = request.headers.get("Origin");
  let adminClient: SupabaseClient<any> | null = null;
  let dispatchRequestId = "";
  let shouldMarkDispatchFailed = false;
  let completedDispatchSentAt = "";
  if (request.method === "OPTIONS") {
    return origin && ALLOWED_ORIGINS.has(origin)
      ? new Response(null, { status: 204, headers: corsHeaders(origin) })
      : json({ error: "Origin not allowed." }, 403, origin);
  }
  if (request.method !== "POST") {
    return json({ error: "Method not allowed." }, 405, origin);
  }
  if (origin && !ALLOWED_ORIGINS.has(origin)) {
    return json({ error: "Origin not allowed." }, 403, origin);
  }
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY || !RESEND_API_KEY || !FROM_EMAIL) {
    return json({ error: "Service configuration is incomplete." }, 503, origin);
  }

  try {
    const authorization = request.headers.get("Authorization") || "";
    const token = authorization.startsWith("Bearer ")
      ? authorization.slice(7)
      : "";
    if (!token) throw new RequestError("Authentication required.", 401);

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    adminClient = supabase;
    const { data: authData, error: authError } = await supabase.auth.getUser(
      token,
    );
    if (authError || !authData.user) {
      throw new RequestError("Invalid or expired session.", 401);
    }
    if (!isAdmin(authData.user)) {
      throw new RequestError("Administrator access required.", 403);
    }

    const contentLength = Number(request.headers.get("content-length") || 0);
    if (contentLength > 16_384) {
      throw new RequestError("Request is too large.", 413);
    }
    const payload = await request.json().catch(() => {
      throw new RequestError("Invalid JSON body.");
    });
    const requestId = parseRequestId(payload?.requestId);
    dispatchRequestId = requestId;
    const leadIds = parseIds(payload?.leadIds, "leadIds", MAX_LEADS);
    const partnerIds = parseIds(
      payload?.partnerIds,
      "partnerIds",
      MAX_PARTNERS,
    );

    const { error: dispatchInsertError } = await supabase
      .from("referral_dispatches")
      .insert({ request_id: requestId, requested_by: authData.user.id });

    if (dispatchInsertError?.code === "23505") {
      const { data: existingDispatch, error: existingDispatchError } =
        await supabase
          .from("referral_dispatches")
          .select("status,sent_at,requested_by")
          .eq("request_id", requestId)
          .single();
      if (
        existingDispatchError ||
        existingDispatch?.requested_by !== authData.user.id
      ) {
        throw new RequestError("Invalid dispatch request.", 409);
      }
      if (existingDispatch.status === "completed") {
        completedDispatchSentAt = existingDispatch.sent_at;
      }
      if (
        !completedDispatchSentAt && existingDispatch.status === "processing"
      ) {
        throw new RequestError(
          "This referral is already being processed.",
          409,
        );
      }
      if (!completedDispatchSentAt) {
        await supabase.from("referral_dispatches").update({
          status: "processing",
          error_code: null,
        })
          .eq("request_id", requestId);
        shouldMarkDispatchFailed = true;
      }
    } else if (dispatchInsertError) {
      throw new Error("Could not create referral audit record.");
    } else {
      shouldMarkDispatchFailed = true;
    }

    const [
      { data: leads, error: leadsError },
      { data: partners, error: partnersError },
    ] = await Promise.all([
      supabase.from("leads").select(
        "lead_id,contact_name,contact_email,contact_phone,contact_method,contact_time,profile,needs,needs_other,move_timing,support_readiness,situation_notes,housing_budget,housing_bedrooms,housing_contract,schools_children_count,schools_children_ages,schools_type,admin_job_contract,admin_address,health_provider,health_cns,bank_account,bank_employed,moving_help,moving_country,language_target,language_level,job_cv_help,job_interview,freelancer_register,freelancer_tax",
      ).in("lead_id", leadIds),
      supabase.from("partners").select("partner_id,name,company,email,active,group,services")
        .in("partner_id", partnerIds),
    ]);
    if (leadsError || partnersError) {
      throw new Error("Could not load referral records.");
    }
    if (!leads || leads.length !== leadIds.length) {
      throw new RequestError("One or more leads were not found.", 404);
    }
    if (
      !partners || partners.length !== partnerIds.length ||
      partners.some((partner) => partner.active === false)
    ) {
      throw new RequestError(
        "One or more active partners were not found.",
        404,
      );
    }
    const partnerScopes = parsePartnerScopes(payload?.partnerScopes, partners);

    const sentToNames = partners.map((partner) =>
      text(partner.name || partner.company || partner.email, 120)
    ).join(", ");
    const sentToEmails = partners.map((partner) =>
      text(partner.email, 254).toLowerCase()
    ).join(", ");

    if (completedDispatchSentAt) {
      return json(
        {
          success: true,
          duplicate: true,
          sentAt: completedDispatchSentAt,
          sentToNames,
          sentToEmails,
          leadCount: leads.length,
          partnerCount: partners.length,
        },
        200,
        origin,
      );
    }

    const { data: priorDeliveries, error: priorDeliveriesError } =
      await supabase
        .from("referral_deliveries")
        .select("partner_id")
        .eq("request_id", requestId);
    if (priorDeliveriesError) {
      throw new Error("Could not load referral delivery history.");
    }
    const deliveredPartnerIds = new Set(
      (priorDeliveries || []).map((row) => row.partner_id),
    );

    for (const partner of partners) {
      if (deliveredPartnerIds.has(partner.partner_id)) continue;
      const email = text(partner.email, 254).toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new RequestError("A partner has an invalid email address.");
      }
      const resendResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: [email],
          subject: `${leads.length} LuxLanding referral${
            leads.length === 1 ? "" : "s"
          }`,
          html: buildEmail(
            partner,
            leads,
            partnerScopes.get(text(partner.partner_id, 100)) || getDefaultPartnerScopes(partner),
          ),
        }),
      });
      if (!resendResponse.ok) {
        console.error("Resend rejected partner referral", {
          status: resendResponse.status,
        });
        throw new Error("Email provider rejected the referral.");
      }
      const resendData = await resendResponse.json().catch(() => ({}));
      const deliveryRows = leads.map((lead) => ({
        request_id: requestId,
        lead_id: lead.lead_id,
        partner_id: partner.partner_id,
        provider_message_id: text(resendData?.id, 200) || null,
      }));
      const { error: deliveryError } = await supabase
        .from("referral_deliveries")
        .insert(deliveryRows);
      if (deliveryError) {
        throw new Error("Email sent, but delivery audit could not be saved.");
      }
    }

    const sentAt = new Date().toISOString();
    const { error: updateError } = await supabase.from("leads").update({
      sent_to: sentToNames,
      sent_to_emails: sentToEmails,
      sent_at: sentAt,
      last_updated: sentAt,
      updated_at: sentAt,
    }).in("lead_id", leadIds);
    if (updateError) {
      throw new Error("Emails sent, but lead history could not be updated.");
    }

    const { error: completionError } = await supabase.from(
      "referral_dispatches",
    ).update({
      status: "completed",
      completed_at: sentAt,
      sent_at: sentAt,
      lead_count: leads.length,
      partner_count: partners.length,
    }).eq("request_id", requestId);
    if (completionError) {
      throw new Error(
        "Referral sent, but dispatch audit could not be completed.",
      );
    }

    return json(
      {
        success: true,
        sentAt,
        sentToNames,
        sentToEmails,
        leadCount: leads.length,
        partnerCount: partners.length,
      },
      200,
      origin,
    );
  } catch (error) {
    if (adminClient && dispatchRequestId && shouldMarkDispatchFailed) {
      await adminClient.from("referral_dispatches").update({
        status: "failed",
        error_code: error instanceof RequestError
          ? `HTTP_${error.status}`
          : "INTERNAL_ERROR",
      }).eq("request_id", dispatchRequestId).eq("status", "processing");
    }
    const status = error instanceof RequestError ? error.status : 500;
    const message = error instanceof RequestError
      ? error.message
      : "Could not send partner referrals.";
    if (status >= 500) console.error("send-leads-to-partners failed", error);
    return json({ error: message }, status, origin);
  }
});
