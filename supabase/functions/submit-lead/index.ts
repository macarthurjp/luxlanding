import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RECAPTCHA_SECRET = Deno.env.get("reCAPTCHA")!;
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const FROM_EMAIL = Deno.env.get("FROM_EMAIL")!;
const NOTIFY_EMAIL = "contact@luxlanding.eu";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ── Label maps ────────────────────────────────────────────────────────────────

const PROFILE_LABELS: Record<string, string> = {
  moving_job: "Moving for a job",
  moving_family: "Moving with family",
  student: "Student",
  freelancer: "Freelancer / Self-employed",
  looking_job: "Looking for a job",
  other: "Other",
};

const TIMING_LABELS: Record<string, string> = {
  "30_days": "Within 30 days",
  "1_3_months": "1–3 months",
  "3_6_months": "3–6 months",
  "6_12_months": "6–12 months",
  exploring: "Just exploring",
};

const READINESS_LABELS: Record<string, string> = {
  yes: "Yes, ready to invest in support",
  maybe: "Maybe, depends on what's offered",
  no: "No, just looking for information",
};

const NEEDS_LABELS: Record<string, string> = {
  housing: "Housing / apartment search",
  admin: "Administrative paperwork",
  schools: "Schools / childcare",
  health: "Health insurance",
  banking: "Banking",
  moving: "Moving services",
  language: "Language courses",
  job: "Job search / CV",
  freelancer: "Freelancer / self-employed",
};

const SCHOOL_TYPE_LABELS: Record<string, string> = {
  public: "Public",
  private: "Private",
  international: "International",
};

const LANG_LABELS: Record<string, string> = {
  fr: "French",
  lu: "Luxembourgish",
  lb: "Luxembourgish",
  de: "German",
  en: "English",
};

const LEVEL_LABELS: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

const BEDROOMS_LABELS: Record<string, string> = {
  studio: "Studio",
  "1": "1 bedroom",
  "2": "2 bedrooms",
  "3": "3 bedrooms",
  "4plus": "4+ bedrooms",
  "1br": "1 bedroom",
  "2br": "2 bedrooms",
  "3br": "3 bedrooms",
  "3plus": "3+ bedrooms",
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function str(val: unknown): string {
  return String(val ?? "").trim();
}

function has(val: unknown): boolean {
  const v = str(val);
  return v !== "" && v !== "—" && v !== "null" && v !== "undefined";
}

function yesNo(val: unknown): string {
  const v = str(val).toLowerCase();
  if (v === "yes" || v === "true" || v === "1") return "Yes";
  if (v === "no" || v === "false" || v === "0") return "No";
  return str(val);
}

function label(map: Record<string, string>, val: unknown): string {
  const v = str(val);
  return map[v] || v;
}

function formatNeeds(needs: unknown): string {
  if (!has(needs)) return "";
  return str(needs)
    .split(/[,\s]+/)
    .filter(Boolean)
    .map((n) => NEEDS_LABELS[n.trim()] || n.trim())
    .join(", ");
}

function row(label: string, value: unknown): string {
  if (!has(value)) return "";
  return `
    <tr>
      <td style="padding:6px 12px 6px 0;color:#6b7280;font-size:13px;white-space:nowrap;vertical-align:top;">${label}</td>
      <td style="padding:6px 0;color:#1a1a2e;font-size:13px;font-weight:600;">${str(value)}</td>
    </tr>`;
}

function section(title: string, rows: string): string {
  const content = rows.trim();
  if (!content) return "";
  return `
    <div style="margin-bottom:24px;">
      <div style="font-size:15px;font-weight:700;color:#1a1a2e;margin-bottom:10px;padding-bottom:6px;border-bottom:2px solid #e5e7eb;">${title}</div>
      <table style="width:100%;border-collapse:collapse;">
        ${content}
      </table>
    </div>`;
}

function hasNeeds(needs: unknown, key: string): boolean {
  return str(needs).toLowerCase().includes(key);
}

// ── reCAPTCHA ─────────────────────────────────────────────────────────────────

async function verifyRecaptcha(token: string | null): Promise<number> {
  if (!token) return 0;
  try {
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret: RECAPTCHA_SECRET, response: token }),
    });
    const data = await res.json();
    if (!data.success) return 0;
    return data.score ?? 0;
  } catch {
    return 0;
  }
}

// ── Email ─────────────────────────────────────────────────────────────────────

async function sendNotification(lead: Record<string, unknown>): Promise<void> {
  const isRepeat = str(lead.duplicate_status) === "REPEAT";
  const statusBadge = isRepeat ? "⚠️ REPEAT LEAD UPDATED" : "🆕 NEW LEAD HOT";
  const scoreNum = Number(lead.lead_score ?? 0);
  const statusLabel = str(lead.lead_status) || "COLD";
  const leadId = str(lead.lead_id);
  const leadName = str(lead.contact_name) || "Unknown";
  const subject = `${statusBadge} — ${leadId} — LuxLanding: ${leadName}`;

  const scoreColor =
    statusLabel === "HOT" ? "#dc2626" : statusLabel === "WARM" ? "#f59e0b" : "#6b7280";

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:24px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">

  <!-- Header -->
  <tr><td style="background:#1a1a2e;padding:28px 32px;">
    <div style="color:#fff;font-size:22px;font-weight:700;letter-spacing:0.5px;">LuxLanding</div>
    <div style="color:#9ca3af;font-size:12px;margin-top:4px;">Lead Notification System</div>
  </td></tr>

  <!-- Score banner -->
  <tr><td style="background:#f9fafb;padding:16px 32px;border-bottom:1px solid #e5e7eb;">
    <table width="100%"><tr>
      <td>
        <span style="display:inline-block;background:${scoreColor};color:#fff;font-size:11px;font-weight:700;padding:4px 12px;border-radius:20px;letter-spacing:1px;">${statusLabel} · ${scoreNum}/100</span>
        ${isRepeat ? '<span style="display:inline-block;background:#f59e0b;color:#fff;font-size:11px;font-weight:700;padding:4px 12px;border-radius:20px;letter-spacing:1px;margin-left:8px;">REPEAT</span>' : ""}
      </td>
      <td align="right" style="color:#9ca3af;font-size:12px;">${new Date().toLocaleString("en-GB", { timeZone: "Europe/Luxembourg" })} (LUX)</td>
    </tr></table>
  </td></tr>

  <!-- Body -->
  <tr><td style="padding:28px 32px;">

    ${section("Contact", [
      row("Name", lead.contact_name),
      row("Email", lead.contact_email),
      row("Phone", lead.contact_phone),
    ].join(""))}

    ${section("Lead Summary", [
      row("Lead ID", lead.lead_id),
      row("Language", label({ en: "English", fr: "French", es: "Spanish", pt: "Portuguese", de: "German", lb: "Luxembourgish" }, lead.language)),
      row("Profile", label(PROFILE_LABELS, lead.profile)),
      has(lead.profile_other) ? row("Profile (other)", lead.profile_other) : "",
      row("Needs", formatNeeds(lead.needs)),
      has(lead.needs_other) ? row("Needs (other)", lead.needs_other) : "",
      row("Move timing", label(TIMING_LABELS, lead.move_timing)),
      row("Support readiness", label(READINESS_LABELS, lead.support_readiness)),
    ].join(""))}

    ${hasNeeds(lead.needs, "housing") ? section("Housing", [
      row("Monthly budget", has(lead.housing_budget) ? `€${str(lead.housing_budget)}/mo` : null),
      row("Bedrooms needed", label(BEDROOMS_LABELS, lead.housing_bedrooms)),
      row("Has work contract", yesNo(lead.housing_contract)),
    ].join("")) : ""}

    ${hasNeeds(lead.needs, "schools") ? section("Schools & Childcare", [
      row("Number of children", lead.schools_children_count),
      row("Ages", lead.schools_children_ages),
      row("School preference", label(SCHOOL_TYPE_LABELS, lead.schools_type)),
    ].join("")) : ""}

    ${hasNeeds(lead.needs, "admin") ? section("Admin Paperwork", [
      row("Already has job contract", yesNo(lead.admin_job_contract)),
      row("Already has Luxembourg address", yesNo(lead.admin_address)),
    ].join("")) : ""}

    ${hasNeeds(lead.needs, "health") ? section("Health Insurance", [
      row("Needs help choosing provider", yesNo(lead.health_provider)),
      row("Already registered with CNS", yesNo(lead.health_cns)),
    ].join("")) : ""}

    ${hasNeeds(lead.needs, "banking") ? section("Banking", [
      row("Needs help opening bank account", yesNo(lead.bank_account)),
      row("Already employed in Luxembourg", yesNo(lead.bank_employed)),
    ].join("")) : ""}

    ${hasNeeds(lead.needs, "moving") ? section("Moving Logistics", [
      row("Needs help with moving company", yesNo(lead.moving_help)),
      row("Moving from", lead.moving_country),
    ].join("")) : ""}

    ${hasNeeds(lead.needs, "language") ? section("Language Courses", [
      row("Language to learn", label(LANG_LABELS, lead.language_target)),
      row("Current level", label(LEVEL_LABELS, lead.language_level)),
    ].join("")) : ""}

    ${hasNeeds(lead.needs, "job") ? section("Job Search", [
      row("Needs help with CV", yesNo(lead.job_cv_help)),
      row("Needs interview preparation", yesNo(lead.job_interview)),
    ].join("")) : ""}

    ${hasNeeds(lead.needs, "freelancer") ? section("Freelancer Setup", [
      row("Needs help registering business", yesNo(lead.freelancer_register)),
      row("Needs tax guidance", yesNo(lead.freelancer_tax)),
    ].join("")) : ""}

    ${has(lead.situation_notes) ? `
    <div style="margin-bottom:20px;">
      <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#9ca3af;margin-bottom:8px;padding-bottom:4px;border-bottom:1px solid #e5e7eb;">Situation Notes</div>
      <div style="background:#f9fafb;border-left:3px solid #1a1a2e;padding:12px 16px;font-size:13px;color:#374151;line-height:1.6;border-radius:0 6px 6px 0;">${str(lead.situation_notes)}</div>
    </div>` : ""}

    ${section("Privacy", [
      row("Consent", lead.privacy_consent),
    ].join(""))}

  </td></tr>

  <!-- Footer -->
  <tr><td style="background:#f9fafb;padding:16px 32px;border-top:1px solid #e5e7eb;text-align:center;color:#9ca3af;font-size:11px;">
    LuxLanding · lead management · ${leadId}
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [NOTIFY_EMAIL],
      reply_to: str(lead.contact_email) || NOTIFY_EMAIL,
      subject,
      html,
    }),
  });
}

// ── Confirmation email to lead ────────────────────────────────────────────────

interface ConfirmCopy {
  subject: string;
  greeting: string;
  intro: string;
  nextTitle: string;
  step1: string;
  step2: string;
  step3: string;
  reply: string;
  regards: string;
  footer: string;
}

const CONFIRM_COPY: Record<string, ConfirmCopy> = {
  en: {
    subject:    "We've received your request — LuxLanding",
    greeting:   "Hi {name},",
    intro:      "Thank you for contacting LuxLanding. We received your relocation request and will review your situation shortly.",
    nextTitle:  "What happens next",
    step1:      "We review your needs.",
    step2:      "We identify the right expert or service for your case.",
    step3:      "We contact you with the next step.",
    reply:      "We usually reply within 24 hours.",
    regards:    "Best regards,",
    footer:     "You received this email because you submitted a relocation request through LuxLanding.",
  },
  fr: {
    subject:    "Nous avons reçu votre demande — LuxLanding",
    greeting:   "Bonjour {name},",
    intro:      "Merci de contacter LuxLanding. Nous avons bien reçu votre demande de relocation et examinerons votre situation très prochainement.",
    nextTitle:  "Prochaines étapes",
    step1:      "Nous analysons vos besoins.",
    step2:      "Nous identifions l'expert ou le service adapté à votre situation.",
    step3:      "Nous vous contactons avec la prochaine étape.",
    reply:      "Nous répondons généralement sous 24 heures.",
    regards:    "Cordialement,",
    footer:     "Vous avez reçu cet e-mail car vous avez soumis une demande de relocation via LuxLanding.",
  },
  es: {
    subject:    "Hemos recibido tu solicitud — LuxLanding",
    greeting:   "Hola {name},",
    intro:      "Gracias por contactar con LuxLanding. Hemos recibido tu solicitud de reubicación y revisaremos tu situación en breve.",
    nextTitle:  "¿Qué pasa ahora?",
    step1:      "Revisamos tus necesidades.",
    step2:      "Identificamos al experto o servicio adecuado para tu caso.",
    step3:      "Te contactamos con el siguiente paso.",
    reply:      "Solemos responder en menos de 24 horas.",
    regards:    "Un saludo,",
    footer:     "Recibiste este correo porque enviaste una solicitud de reubicación a través de LuxLanding.",
  },
  pt: {
    subject:    "Recebemos o seu pedido — LuxLanding",
    greeting:   "Olá {name},",
    intro:      "Obrigado por contactar a LuxLanding. Recebemos o seu pedido de relocalização e iremos analisar a sua situação em breve.",
    nextTitle:  "O que acontece a seguir",
    step1:      "Analisamos as suas necessidades.",
    step2:      "Identificamos o especialista ou serviço certo para o seu caso.",
    step3:      "Entramos em contacto com o próximo passo.",
    reply:      "Respondemos normalmente em 24 horas.",
    regards:    "Com os melhores cumprimentos,",
    footer:     "Recebeu este e-mail porque submeteu um pedido de relocalização através da LuxLanding.",
  },
  de: {
    subject:    "Wir haben Ihre Anfrage erhalten — LuxLanding",
    greeting:   "Hallo {name},",
    intro:      "Vielen Dank, dass Sie LuxLanding kontaktiert haben. Wir haben Ihre Relokationsanfrage erhalten und werden Ihre Situation in Kürze prüfen.",
    nextTitle:  "Was als Nächstes passiert",
    step1:      "Wir prüfen Ihre Bedürfnisse.",
    step2:      "Wir ermitteln den richtigen Experten oder Service für Ihren Fall.",
    step3:      "Wir melden uns mit dem nächsten Schritt.",
    reply:      "Wir antworten in der Regel innerhalb von 24 Stunden.",
    regards:    "Mit freundlichen Grüßen,",
    footer:     "Sie erhalten diese E-Mail, weil Sie über LuxLanding eine Relokationsanfrage gestellt haben.",
  },
};

async function sendConfirmation(lead: Record<string, unknown>): Promise<void> {
  const to = str(lead.contact_email);
  if (!to) return;

  const lang = str(lead.language).toLowerCase().slice(0, 2);
  const c = CONFIRM_COPY[lang] || CONFIRM_COPY.en;
  const name = str(lead.contact_name) || to;
  const greeting = c.greeting.replace("{name}", escapeHtml(name));

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f0f2f5;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f2f5;padding:32px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

  <!-- Header -->
  <tr><td style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 100%);padding:32px 40px;">
    <div style="color:#fff;font-size:28px;font-weight:800;letter-spacing:-0.5px;">LuxLanding</div>
    <div style="color:#9ca3af;font-size:14px;margin-top:6px;">Luxembourg relocation support</div>
  </td></tr>

  <!-- Body -->
  <tr><td style="padding:40px;">

    <div style="font-size:22px;font-weight:700;color:#111827;margin-bottom:20px;">${greeting}</div>

    <div style="font-size:18px;color:#4b5563;line-height:1.7;margin-bottom:32px;">
      ${c.intro}
    </div>

    <!-- What happens next card -->
    <div style="background:#f8fafc;border:1px solid #e5e7eb;border-radius:14px;padding:24px 28px;margin-bottom:32px;">
      <div style="font-size:16px;font-weight:700;color:#111827;margin-bottom:16px;">${c.nextTitle}</div>
      <table cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td style="vertical-align:top;padding-bottom:12px;">
            <span style="color:#3b82f6;font-weight:700;font-size:15px;">1.&nbsp;</span>
            <span style="font-size:15px;color:#374151;">${c.step1}</span>
          </td>
        </tr>
        <tr>
          <td style="vertical-align:top;padding-bottom:12px;">
            <span style="color:#3b82f6;font-weight:700;font-size:15px;">2.&nbsp;</span>
            <span style="font-size:15px;color:#374151;">${c.step2}</span>
          </td>
        </tr>
        <tr>
          <td style="vertical-align:top;">
            <span style="color:#3b82f6;font-weight:700;font-size:15px;">3.&nbsp;</span>
            <span style="font-size:15px;color:#374151;">${c.step3}</span>
          </td>
        </tr>
      </table>
    </div>

    <div style="font-size:18px;color:#4b5563;line-height:1.7;margin-bottom:32px;">${c.reply}</div>

    <div style="font-size:14px;color:#6b7280;">${c.regards}</div>
    <div style="font-size:15px;font-weight:700;color:#111827;">LuxLanding</div>

  </td></tr>

  <!-- Footer -->
  <tr><td style="padding:20px 40px;border-top:1px solid #e5e7eb;text-align:center;">
    <div style="font-size:13px;color:#9ca3af;line-height:1.6;">${c.footer}</div>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [to],
      reply_to: NOTIFY_EMAIL,
      subject: c.subject,
      html,
    }),
  });
}

function escapeHtml(s: string): string {
  return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

// ── Handler ───────────────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { lead, recaptchaToken } = await req.json();

    const score = await verifyRecaptcha(recaptchaToken ?? null);

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    const { error } = await supabase.from("leads").insert({ ...lead });

    if (error) {
      console.error("Insert error:", error);
      return new Response(
        JSON.stringify({ error: "Could not save your request. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    sendNotification({ ...lead, _recaptcha_score: score }).catch((e) =>
      console.error("Notification email error:", e)
    );
    sendConfirmation(lead).catch((e) =>
      console.error("Confirmation email error:", e)
    );

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(
      JSON.stringify({ error: "Unexpected error. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
