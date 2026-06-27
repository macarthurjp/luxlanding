/* =========================================================
   LUXLANDING · SUBMIT.JS
   SUPABASE VERSION
========================================================= */

/* =========================================================
   SUPABASE CONFIG (v2)
========================================================= */

const SUPABASE_URL = "https://itldyciokbtzwufrrifh.supabase.co";
const SITE_URL = "https://luxlanding.eu/";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0bGR5Y2lva2J0end1ZnJyaWZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MTM5OTMsImV4cCI6MjA5NDA4OTk5M30.GPcmLPH9kkndW3VycqbR6yFoKERiY6URfH4SmpusJUg";
const RECAPTCHA_SITE_KEY = "6Le7tsIsAAAAAPcPGZtFzwO-aZ-CUq11bhyQKIFd";

const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* =========================================================
   RECAPTCHA V3

   The script is skipped on localhost (see index.html), so grecaptcha
   may not exist there — getRecaptchaToken() degrades to null and the
   submit-lead function treats a missing token as score 0 in that case.
========================================================= */

function getRecaptchaToken() {
  if (typeof grecaptcha === "undefined") return Promise.resolve(null);

  return new Promise((resolve) => {
    grecaptcha.ready(() => {
      grecaptcha
        .execute(RECAPTCHA_SITE_KEY, { action: "submit_lead" })
        .then(resolve)
        .catch(() => resolve(null));
    });
  });
}


/* =========================================================
   HELPERS
========================================================= */

function generateLeadId() {
  const date = new Date()
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, "");

  const random = Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase();

  return `LUX-${date}-${random}`;
}

function normalizePhone(phone) {
  return (phone || "").replace(/\D/g, "");
}

function normalizeEmail(email) {
  return (email || "").trim().toLowerCase();
}

function emptyToNull(value) {
  return value === "" || value === undefined ? null : value;
}

/* =========================================================
   LEAD SCORING
========================================================= */

function calculateLeadScore(data) {
  let score = 0;
  const needs = String(data.needs || "").toLowerCase();

  if (data.support_readiness === "yes") score += 35;
  if (data.support_readiness === "maybe") score += 20;

  if (data.move_timing === "30_days") score += 30;
  if (data.move_timing === "1_3_months") score += 20;
  if (data.move_timing === "3_6_months") score += 10;

  if (data.contact_phone) score += 15;
  if (data.contact_email) score += 10;

  if (needs.includes("housing")) score += 15;
  if (needs.includes("admin")) score += 10;
  if (needs.includes("schools")) score += 10;
  if (needs.includes("banking")) score += 5;
  if (needs.includes("moving")) score += 5;
  if (needs.includes("language")) score += 5;
  if (needs.includes("job")) score += 10;

  if (data.housing_budget && Number(data.housing_budget) >= 1500) {
    score += 10;
  }

  if (data.situation_notes && data.situation_notes.length > 20) {
    score += 10;
  }

  return Math.min(score, 100);
}

function getLeadStatus(score) {
  if (score >= 80) return "HOT";
  if (score >= 50) return "WARM";
  return "COLD";
}

function getSuccessMessage(lang) {
  const cleanLang = String(lang || "en").toLowerCase();

  if (cleanLang === "fr") {
    return "Votre demande a été envoyée avec succès !";
  }

  if (cleanLang === "es") {
    return "¡Tu solicitud se ha enviado correctamente!";
  }

  if (cleanLang === "pt") {
    return "O seu pedido foi enviado com sucesso!";
  }

  return "Your request has been sent successfully!";
}

function getErrorMessage(lang) {
  const cleanLang = String(lang || "en").toLowerCase();

  if (cleanLang === "fr") {
    return "Erreur lors de l'envoi : ";
  }

  if (cleanLang === "es") {
    return "Error al enviar la solicitud: ";
  }

  if (cleanLang === "pt") {
    return "Erro ao enviar o pedido: ";
  }

  return "Error sending your request: ";
}
/* =========================================================
   FORM SUBMISSION

   Duplicate detection used to run client-side via a public
   SELECT against the leads table. That required Supabase RLS
   to allow anonymous SELECT on a table containing customer PII
   (emails, phones, notes), which exposed every lead to anyone
   opening devtools. Duplicate detection now happens server-side
   inside the send-lead-notifications Edge Function, which uses
   the service_role key and is never reachable from the browser.

   The leads table also no longer accepts a direct anon INSERT —
   that would let a bot bypass reCAPTCHA entirely by calling the
   REST API directly. The insert now happens inside the submit-lead
   Edge Function, which verifies the reCAPTCHA token server-side
   (with the secret key, never exposed to the browser) before
   writing anything.
========================================================= */

async function submitLead(event) {
  event.preventDefault();

  const form = event.target;
  const formData = Object.fromEntries(new FormData(form).entries());

  formData.language = String(
    window.currentLang ||
    document.documentElement.lang ||
    document.querySelector(".lang-switch a.active")?.dataset.lang ||
    "en"
  ).toLowerCase();

  formData.profile =
    document.querySelector('input[name="profile"]:checked')?.value || "";

  formData.needs = [...document.querySelectorAll('input[name="needs"]:checked')]
    .map(input => input.value)
    .join(", ");

  formData.profile_other =
    document.getElementById("profile-other-input")?.value.trim() || "";

  formData.needs_other =
    document.getElementById("needs-other-input")?.value.trim() || "";

  formData.contact_email = normalizeEmail(formData.contact_email);
  formData.contact_phone = normalizePhone(formData.contact_phone);
  formData.housing_budget = emptyToNull(formData.housing_budget);

  const score = calculateLeadScore(formData);
  const leadStatus = getLeadStatus(score);
  const now = new Date().toISOString();

  const lead = {
    lead_id: generateLeadId(),
    timestamp: now,
    last_updated: now,
    lead_score: score,
    lead_status: leadStatus,
    repeat_count: 1,
    duplicate_status: "NEW",
    payment_status: "Unpaid",
    status: "New",
    sent_to: "",
    sent_to_emails: "",
    sent_at: null,
    paid_at: null,
    lead_price: 0,
    ...formData
  };

  const recaptchaToken = await getRecaptchaToken();

  let submitResult;
  try {
    const submitResponse = await fetch(
      `${SUPABASE_URL}/functions/v1/submit-lead`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_ANON_KEY,
          "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ lead, recaptchaToken })
      }
    );

    submitResult = await submitResponse.json().catch(() => ({}));

    if (!submitResponse.ok) {
      throw new Error(submitResult.error || "Could not submit your request.");
    }
  } catch (submitError) {
    console.error(submitError);
    alert(getErrorMessage(formData.language) + submitError.message);
    return;
  }

  // Fired only after the server confirms the lead was actually written —
  // a client-side-only event here would count requests that reCAPTCHA or
  // validation later rejected as conversions.
  if (typeof gtag === "function") {
    gtag("event", "generate_lead", {
      lead_id: lead.lead_id,
      profile: formData.profile,
      needs: formData.needs,
      lead_score: score,
      lead_status: leadStatus,
      language: formData.language
    });
  }

  alert(getSuccessMessage(formData.language));
  form.reset();

  const thankYouPage = document.getElementById("page-thankyou");
  const intakeForm = document.getElementById("intake-form");
  const formContainer = document.getElementById("form-container");

  if (intakeForm) intakeForm.hidden = true;
  if (thankYouPage) thankYouPage.hidden = false;

  if (formContainer) {
    formContainer.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  setTimeout(() => {
    window.location.href = SITE_URL;
  }, 10000);
}

/* =========================================================
   INIT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#intake-form");

  if (form) {
    form.addEventListener("submit", submitLead);
  }
});
