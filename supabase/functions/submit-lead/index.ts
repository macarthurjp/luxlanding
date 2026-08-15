import { createClient, type SupabaseClient } from "npm:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RECAPTCHA_SECRET = Deno.env.get("reCAPTCHA")!;
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const FROM_EMAIL = Deno.env.get("FROM_EMAIL")!;
const NOTIFY_EMAIL = "contact@luxlanding.eu";
const RECAPTCHA_MIN_SCORE = Number(Deno.env.get("RECAPTCHA_MIN_SCORE") || "0.5");
const RATE_LIMIT_SALT = Deno.env.get("RATE_LIMIT_SALT")!;
const RATE_LIMIT_MAX_ATTEMPTS = 8;
const PRIVACY_NOTICE_VERSION = "2026-08-13";
const ALLOWED_ORIGINS = new Set(
  (Deno.env.get("ALLOWED_ORIGINS") || "https://luxlanding.eu,https://www.luxlanding.eu,https://luxlanding-migration-platform-staging.macarthurjeanpierre.workers.dev,http://localhost:4173,http://localhost:4174,http://localhost:4175")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
);

function corsHeaders(origin: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }
  return headers;
}

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
  exploring: "No, just looking for information",
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

function cleanText(val: unknown, maxLength: number): string {
  return Array.from(str(val), (character) => {
    const code = character.charCodeAt(0);
    return code < 32 || code === 127 ? " " : character;
  }).join("").replace(/\s+/g, " ").slice(0, maxLength);
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

function formatEuro(value: unknown): string {
  const amount = Number(value);
  return Number.isFinite(amount)
    ? new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR" }).format(amount)
    : "";
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
      <td style="padding:6px 0;color:#1a1a2e;font-size:13px;font-weight:600;word-break:break-word;overflow-wrap:anywhere;">${escapeHtml(str(value))}</td>
    </tr>`;
}

class ValidationError extends Error {}
class RateLimitError extends Error {}

async function sha256(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function enforceRateLimit(
  supabase: SupabaseClient<any>,
  req: Request,
): Promise<void> {
  const forwardedIp = str(req.headers.get("x-forwarded-for")).split(",")[0].trim();
  const ip = str(req.headers.get("cf-connecting-ip")) || forwardedIp;
  if (!ip || !RATE_LIMIT_SALT) throw new ValidationError("Security configuration is incomplete.");

  // v2 intentionally resets fingerprints created before CAPTCHA and payload
  // validation were moved ahead of rate limiting.
  const fingerprint = await sha256(`${RATE_LIMIT_SALT}:v2:${ip}`);
  const cutoff = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count, error: countError } = await supabase
    .from("lead_submission_attempts")
    .select("id", { count: "exact", head: true })
    .eq("fingerprint", fingerprint)
    .gte("created_at", cutoff);

  if (countError) throw countError;
  if ((count || 0) >= RATE_LIMIT_MAX_ATTEMPTS) {
    throw new RateLimitError("Too many requests. Please try again later.");
  }

  const { error: insertError } = await supabase
    .from("lead_submission_attempts")
    .insert({ fingerprint });
  if (insertError) throw insertError;

  if (crypto.getRandomValues(new Uint8Array(1))[0] < 16) {
    const retentionCutoff = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
    await supabase.from("lead_submission_attempts").delete().lt("created_at", retentionCutoff);
  }
}

const ALLOWED_PROFILES = new Set(Object.keys(PROFILE_LABELS));
const ALLOWED_NEEDS = new Set([...Object.keys(NEEDS_LABELS), "other"]);
const ALLOWED_LANGUAGES = new Set(["en", "fr", "es", "pt"]);
const ALLOWED_CONTACT_METHODS = new Set(["email", "whatsapp", "phone"]);
const ALLOWED_CONTACT_TIMES = new Set(["morning", "afternoon", "evening"]);
const OPTIONAL_FIELDS: Record<string, number> = {
  profile_other: 120,
  needs_other: 200,
  housing_bedrooms: 20,
  housing_contract: 10,
  schools_children_count: 3,
  schools_children_ages: 80,
  schools_type: 30,
  admin_job_contract: 10,
  admin_address: 10,
  health_provider: 10,
  health_cns: 10,
  bank_account: 10,
  bank_employed: 10,
  moving_help: 10,
  moving_country: 100,
  language_target: 10,
  language_level: 30,
  job_cv_help: 10,
  job_interview: 10,
  freelancer_register: 10,
  freelancer_tax: 10,
  situation_notes: 2000,
  move_timing: 30,
  support_readiness: 30,
  contact_method: 10,
  contact_time: 12,
  client_timezone: 80,
  utm_source: 120,
  utm_medium: 120,
  utm_campaign: 160,
  utm_term: 160,
  utm_content: 160,
  landing_page: 500,
  referrer: 500,
};

function normalizeEmail(value: unknown): string {
  const email = cleanText(value, 254).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new ValidationError("Please enter a valid email address.");
  }
  return email;
}

function normalizePhone(value: unknown): string {
  const phone = cleanText(value, 24);
  if (phone && !/^\+?[0-9 ()-]{6,24}$/.test(phone)) {
    throw new ValidationError("Please enter a valid phone number.");
  }
  const normalized = phone.replace(/[^\d+]/g, "");
  if (normalized && !/^\+[1-9]\d{6,14}$/.test(normalized)) {
    throw new ValidationError("Please enter a valid international phone number.");
  }
  return normalized;
}

function parseSubmissionId(value: unknown): string | null {
  if (!value) return null;
  const submissionId = cleanText(value, 36).toLowerCase();
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(submissionId)) {
    throw new ValidationError("Invalid submission identifier.");
  }
  return submissionId;
}

function normalizeLead(input: unknown): Record<string, unknown> {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new ValidationError("Invalid request.");
  }

  const raw = input as Record<string, unknown>;
  const profile = cleanText(raw.profile, 30);
  const language = cleanText(raw.language, 2).toLowerCase();
  const needsList = str(raw.needs).split(",").map((need) => cleanText(need, 30).toLowerCase()).filter(Boolean);
  const contactName = cleanText(raw.contact_name, 120);
  const contactMethod = cleanText(raw.contact_method, 10).toLowerCase();
  const contactTime = cleanText(raw.contact_time, 12).toLowerCase();

  if (!contactName) throw new ValidationError("Please enter your name.");
  if (!ALLOWED_CONTACT_METHODS.has(contactMethod)) throw new ValidationError("Please select a valid contact method.");
  if (contactTime && !ALLOWED_CONTACT_TIMES.has(contactTime)) throw new ValidationError("Please select a valid contact time.");
  if (!ALLOWED_PROFILES.has(profile)) throw new ValidationError("Please select a valid profile.");
  if (!ALLOWED_LANGUAGES.has(language)) throw new ValidationError("Please select a valid language.");
  if (!needsList.length || needsList.some((need) => !ALLOWED_NEEDS.has(need))) {
    throw new ValidationError("Please select at least one valid service.");
  }
  if (str(raw.privacy_consent) !== "yes") {
    throw new ValidationError("Privacy consent is required.");
  }

  const contactPhone = normalizePhone(raw.contact_phone);
  if ((contactMethod === "whatsapp" || contactMethod === "phone") && !contactPhone) {
    throw new ValidationError("A phone number is required for the selected contact method.");
  }

  const lead: Record<string, unknown> = {
    contact_name: contactName,
    contact_email: normalizeEmail(raw.contact_email),
    contact_phone: contactPhone,
    contact_method: contactMethod,
    language,
    profile,
    needs: [...new Set(needsList)].join(", "),
      privacy_consent: "yes",
  };

  for (const [field, maxLength] of Object.entries(OPTIONAL_FIELDS)) {
    const value = cleanText(raw[field], maxLength);
    if (value) lead[field] = value;
  }

  const housingBudget = Number(raw.housing_budget);
  if (has(raw.housing_budget) && (!Number.isFinite(housingBudget) || housingBudget < 0 || housingBudget > 100000)) {
    throw new ValidationError("Please enter a valid housing budget.");
  }
  lead.housing_budget = has(raw.housing_budget) ? Math.round(housingBudget) : null;
  return lead;
}

function calculateLeadScore(lead: Record<string, unknown>): number {
  let score = 0;
  const needs = str(lead.needs).toLowerCase();
  if (lead.support_readiness === "yes") score += 35;
  if (lead.support_readiness === "maybe") score += 20;
  if (lead.move_timing === "30_days") score += 30;
  if (lead.move_timing === "1_3_months") score += 20;
  if (lead.move_timing === "3_6_months") score += 10;
  if (has(lead.contact_phone)) score += 15;
  if (has(lead.contact_email)) score += 10;
  if (needs.includes("housing")) score += 15;
  if (needs.includes("admin")) score += 10;
  if (needs.includes("schools")) score += 10;
  if (needs.includes("banking")) score += 5;
  if (needs.includes("moving")) score += 5;
  if (needs.includes("language")) score += 5;
  if (needs.includes("job")) score += 10;
  if (Number(lead.housing_budget) >= 1500) score += 10;
  if (str(lead.situation_notes).length > 20) score += 10;
  return Math.min(score, 100);
}

function getLeadStatus(score: number): string {
  if (score >= 80) return "HOT";
  if (score >= 50) return "WARM";
  return "COLD";
}

function generateLeadId(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const random = crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase();
  return `LUX-${date}-${random}`;
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

interface RecaptchaResult {
  success?: boolean;
  score?: number;
  action?: string;
  hostname?: string;
  errorCodes?: string[];
}

async function verifyRecaptcha(token: string | null): Promise<RecaptchaResult> {
  if (!token) return { success: false, score: 0 };
  const endpoints = [
    "https://www.google.com/recaptcha/api/siteverify",
    "https://www.recaptcha.net/recaptcha/api/siteverify",
  ];

  for (const [index, endpoint] of endpoints.entries()) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ secret: RECAPTCHA_SECRET, response: token }),
      });
      if (!res.ok) throw new Error(`verification endpoint returned ${res.status}`);

      const data = await res.json();
      return {
        success: data.success === true,
        score: Number(data.score ?? 0),
        action: str(data.action),
        hostname: str(data.hostname),
        errorCodes: Array.isArray(data["error-codes"])
          ? data["error-codes"].map((code: unknown) => str(code)).filter(Boolean)
          : [],
      };
    } catch (error) {
      console.warn("reCAPTCHA verification endpoint unavailable", {
        provider: index === 0 ? "google.com" : "recaptcha.net",
        error: error instanceof Error ? error.name : "unknown",
      });
    }
  }

  return { success: false, score: 0, errorCodes: ["verification-service-unavailable"] };
}

// ── Email ─────────────────────────────────────────────────────────────────────

async function sendResendEmail(payload: Record<string, unknown>): Promise<void> {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    console.error("Resend rejected email", { status: response.status });
    throw new Error(`Email provider returned ${response.status}.`);
  }
}

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
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
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
      row("Preferred channel", label({ email: "Email", whatsapp: "WhatsApp", phone: "Phone call" }, lead.contact_method)),
      row("Best contact time", label({ morning: "Morning", afternoon: "Afternoon", evening: "Evening" }, lead.contact_time)),
      row("Client timezone", lead.client_timezone),
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

    ${section("Attribution", [
      row("UTM source", lead.utm_source),
      row("UTM medium", lead.utm_medium),
      row("UTM campaign", lead.utm_campaign),
      row("UTM term", lead.utm_term),
      row("UTM content", lead.utm_content),
      row("Landing page", lead.landing_page),
      row("Referrer", lead.referrer),
    ].join(""))}

    ${hasNeeds(lead.needs, "housing") ? section("Housing", [
      row("Monthly budget", has(lead.housing_budget) ? `${formatEuro(lead.housing_budget)}/mo` : null),
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
      <div style="background:#f9fafb;border-left:3px solid #1a1a2e;padding:12px 16px;font-size:13px;color:#374151;line-height:1.6;border-radius:0 6px 6px 0;">${escapeHtml(str(lead.situation_notes))}</div>
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

  await sendResendEmail({
    from: FROM_EMAIL,
    to: [NOTIFY_EMAIL],
    reply_to: str(lead.contact_email) || NOTIFY_EMAIL,
    subject,
    html,
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
  reference: string;
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
    reference:  "Request reference",
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
    reference:  "Référence de la demande",
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
    reference:  "Referencia de la solicitud",
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
    reference:  "Referência do pedido",
    regards:    "Com os melhores cumprimentos,",
    footer:     "Recebeu este e-mail porque submeteu um pedido de relocalização através da LuxLanding.",
  },
};

async function sendConfirmation(lead: Record<string, unknown>): Promise<void> {
  const to = str(lead.contact_email);
  if (!to) return;

  const lang = str(lead.language).toLowerCase().slice(0, 2);
  const c = CONFIRM_COPY[lang] || CONFIRM_COPY.en;
  const name = str(lead.contact_name) || to;
  const greeting = c.greeting.replace("{name}", escapeHtml(name));
  const referenceSource = str(lead.lead_id).replace(/-/g, "");
  const reference = referenceSource ? `LL-${referenceSource.slice(0, 8).toUpperCase()}` : "LuxLanding";

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fb;padding:32px 12px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border:1px solid #e1e8f2;border-radius:20px;overflow:hidden;box-shadow:0 16px 44px rgba(23,32,51,0.10);">

  <!-- Header -->
  <tr><td style="background:#17233d;padding:30px 36px;border-bottom:4px solid #4a90e2;">
    <div style="color:#fff;font-size:26px;font-weight:800;letter-spacing:-0.5px;">LuxLanding</div>
    <div style="color:#c8d5e8;font-size:13px;margin-top:6px;letter-spacing:0.02em;">Luxembourg relocation support</div>
  </td></tr>

  <!-- Body -->
  <tr><td style="padding:38px 36px;">

    <div style="font-size:22px;font-weight:700;color:#111827;margin-bottom:20px;">${greeting}</div>

    <div style="font-size:18px;color:#4b5563;line-height:1.7;margin-bottom:32px;">
      ${c.intro}
    </div>

    <div style="margin-bottom:28px;padding:14px 18px;background:#edf5ff;border:1px solid #cfe2f8;border-radius:12px;color:#41516a;font-size:14px;">
      ${c.reference}: <strong style="color:#17233d;letter-spacing:0.05em;">${reference}</strong>
    </div>

    <!-- What happens next card -->
    <div style="background:#f8fafc;border:1px solid #e1e8f2;border-radius:14px;padding:24px;margin-bottom:28px;">
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

    <div style="font-size:16px;color:#41516a;line-height:1.7;margin-bottom:30px;padding-left:14px;border-left:3px solid #4a90e2;">${c.reply}</div>

    <div style="font-size:14px;color:#6b7280;">${c.regards}</div>
    <div style="font-size:15px;font-weight:700;color:#111827;">LuxLanding</div>

  </td></tr>

  <!-- Footer -->
  <tr><td style="padding:20px 32px;border-top:1px solid #e5e7eb;text-align:center;background:#fbfcfe;">
    <div style="font-size:13px;color:#9ca3af;line-height:1.6;">${c.footer}</div>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;

  await sendResendEmail({
    from: FROM_EMAIL,
    to: [to],
    reply_to: NOTIFY_EMAIL,
    subject: c.subject,
    html,
  });
}

function escapeHtml(s: string): string {
  return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

// ── Handler ───────────────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");
  const responseHeaders = corsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: origin && ALLOWED_ORIGINS.has(origin) ? 204 : 403,
      headers: responseHeaders,
    });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed." }), {
      status: 405,
      headers: { ...responseHeaders, "Content-Type": "application/json", "Allow": "POST, OPTIONS" },
    });
  }

  if (!origin || !ALLOWED_ORIGINS.has(origin)) {
    return new Response(JSON.stringify({ error: "Origin not allowed." }), {
      status: 403,
      headers: { ...responseHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const contentLength = Number(req.headers.get("content-length") || "0");
    if (contentLength > 25_000) {
      return new Response(JSON.stringify({ error: "Request too large." }), {
        status: 413,
        headers: { ...responseHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const body = await req.json();
    const recaptcha = await verifyRecaptcha(str(body.recaptchaToken) || null);

    if (!recaptcha.success || recaptcha.action !== "submit_lead" || (recaptcha.score ?? 0) < RECAPTCHA_MIN_SCORE) {
      const isStaging = origin === "https://luxlanding-migration-platform-staging.macarthurjeanpierre.workers.dev";
      const retryable = recaptcha.errorCodes?.includes("browser-error") === true;
      const diagnostic = !recaptcha.success
        ? "verification_failed"
        : recaptcha.action !== "submit_lead"
        ? "action_mismatch"
        : "score_too_low";
      console.warn("reCAPTCHA rejected submission", {
        diagnostic,
        hostname: recaptcha.hostname || null,
        action: recaptcha.action || null,
        score: recaptcha.score ?? null,
        errorCodes: recaptcha.errorCodes || [],
      });
      return new Response(JSON.stringify({
        error: "Security verification failed. Please try again.",
        retryable,
        ...(isStaging
          ? {
              diagnostic,
              hostname: recaptcha.hostname || null,
              action: recaptcha.action || null,
              score: recaptcha.score ?? null,
              errorCodes: recaptcha.errorCodes || [],
            }
          : {}),
      }), {
        status: 403,
        headers: { ...responseHeaders, "Content-Type": "application/json" },
      });
    }

    const submittedLead = normalizeLead(body.lead);
    const submissionId = parseSubmissionId(body.submissionId);

    // Only a verified, structurally valid request consumes the hourly quota.
    // Invalid CAPTCHA attempts must not be able to lock out legitimate users.
    await enforceRateLimit(supabase, req);

    if (submissionId) {
      const { data: existingLead, error: existingLeadError } = await supabase
        .from("leads")
        .select("lead_id,lead_score,lead_status,notification_email_status,confirmation_email_status")
        .eq("submission_id", submissionId)
        .maybeSingle();
      if (existingLeadError) throw existingLeadError;
      if (existingLead) {
        return new Response(JSON.stringify({
          success: true,
          duplicate: true,
          lead_id: existingLead.lead_id,
          lead_score: existingLead.lead_score,
          lead_status: existingLead.lead_status,
          email_delivery: {
            notification: existingLead.notification_email_status,
            confirmation: existingLead.confirmation_email_status,
          },
        }), {
          status: 200,
          headers: { ...responseHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const leadScore = calculateLeadScore(submittedLead);
    const now = new Date().toISOString();
    const lead = {
      ...submittedLead,
      submission_id: submissionId,
      lead_id: generateLeadId(),
      timestamp: now,
      consented_at: now,
      privacy_notice_version: PRIVACY_NOTICE_VERSION,
      last_updated: now,
      lead_score: leadScore,
      lead_status: getLeadStatus(leadScore),
      repeat_count: 1,
      duplicate_status: "NEW",
      payment_status: "Unpaid",
      status: "New",
      sent_to: "",
      sent_to_emails: "",
      sent_at: null,
      paid_at: null,
      lead_price: 0,
    };

    const { error } = await supabase.from("leads").insert({ ...lead });

    if (error?.code === "23505" && submissionId) {
      const { data: existingLead } = await supabase
        .from("leads")
        .select("lead_id,lead_score,lead_status,notification_email_status,confirmation_email_status")
        .eq("submission_id", submissionId)
        .single();
      if (existingLead) {
        return new Response(JSON.stringify({
          success: true,
          duplicate: true,
          lead_id: existingLead.lead_id,
          lead_score: existingLead.lead_score,
          lead_status: existingLead.lead_status,
          email_delivery: {
            notification: existingLead.notification_email_status,
            confirmation: existingLead.confirmation_email_status,
          },
        }), {
          status: 200,
          headers: { ...responseHeaders, "Content-Type": "application/json" },
        });
      }
    }

    if (error) {
      console.error("Insert error:", error);
      return new Response(
        JSON.stringify({ error: "Could not save your request. Please try again." }),
        { status: 500, headers: { ...responseHeaders, "Content-Type": "application/json" } }
      );
    }

    const [notificationResult, confirmationResult] = await Promise.allSettled([
      sendNotification({ ...lead, _recaptcha_score: recaptcha.score }),
      sendConfirmation(lead),
    ]);
    const notificationEmailStatus = notificationResult.status === "fulfilled" ? "sent" : "failed";
    const confirmationEmailStatus = confirmationResult.status === "fulfilled" ? "sent" : "failed";
    if (notificationResult.status === "rejected") {
      console.error("Notification email failed", { leadId: lead.lead_id });
    }
    if (confirmationResult.status === "rejected") {
      console.error("Confirmation email failed", { leadId: lead.lead_id });
    }

    const { error: emailStatusError } = await supabase.from("leads").update({
      notification_email_status: notificationEmailStatus,
      confirmation_email_status: confirmationEmailStatus,
      email_delivery_checked_at: new Date().toISOString(),
    }).eq("lead_id", lead.lead_id);
    if (emailStatusError) {
      console.error("Could not save email delivery status", { leadId: lead.lead_id });
    }

    return new Response(
      JSON.stringify({
        success: true,
        lead_id: lead.lead_id,
        lead_score: lead.lead_score,
        lead_status: lead.lead_status,
        email_delivery: {
          notification: notificationEmailStatus,
          confirmation: confirmationEmailStatus,
        },
      }),
      { status: 200, headers: { ...responseHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    if (err instanceof RateLimitError) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 429,
        headers: {
          ...responseHeaders,
          "Content-Type": "application/json",
          "Retry-After": "3600",
        },
      });
    }
    const isValidationError = err instanceof ValidationError;
    if (!isValidationError) console.error("Unexpected error:", err);
    return new Response(
      JSON.stringify({ error: isValidationError ? err.message : "Unexpected error. Please try again." }),
      { status: isValidationError ? 400 : 500, headers: { ...responseHeaders, "Content-Type": "application/json" } }
    );
  }
});
