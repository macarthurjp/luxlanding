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

const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


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
/* =========================================================
   DUPLICATE CHECK
========================================================= */

async function findDuplicateLead(email, phone) {
  let query = supabaseClient
    .from("leads")
    .select("*")
    .limit(1);

  if (email && phone) {
    query = query.or(`contact_email.eq.${email},contact_phone.eq.${phone}`);
  } else if (email) {
    query = query.eq("contact_email", email);
  } else if (phone) {
    query = query.eq("contact_phone", phone);
  } else {
    return null;
  }

  const { data, error } = await query;

  if (error) {
    console.error(error);
    return null;
  }

  return data && data.length ? data[0] : null;
}


/* =========================================================
   FORM SUBMISSION
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

  const duplicate = await findDuplicateLead(
    formData.contact_email,
    formData.contact_phone
  );

  let duplicateStatus = "NEW";
  let repeatCount = 1;

  if (duplicate) {
    duplicateStatus = "UPDATED DUPLICATE";
    repeatCount = Number(duplicate.repeat_count || 1) + 1;
  }

  const now = new Date().toISOString();

  const lead = {
    lead_id: generateLeadId(),
    timestamp: now,
    last_updated: now,
    lead_score: score,
    lead_status: leadStatus,
    repeat_count: repeatCount,
    duplicate_status: duplicateStatus,
    payment_status: "Unpaid",
    status: "New",
    sent_to: "",
    sent_to_emails: "",
    sent_at: null,
    paid_at: null,
    lead_price: 0,
    ...formData
  };

  const { error } = await supabaseClient
    .from("leads")
    .insert([lead]);

  if (error) {
    console.error(error);
    alert("Erreur lors de l’envoi : " + error.message);
    return;
  }

  try {
    const notificationResponse = await fetch(
      "https://itldyciokbtzwufrrifh.supabase.co/functions/v1/send-lead-notifications",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_ANON_KEY,
          "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ lead })
      }
    );

    const notificationResult = await notificationResponse.json().catch(() => ({}));

    if (!notificationResponse.ok) {
      console.error("Lead notification failed:", notificationResult);
    }
  } catch (notificationError) {
    console.error("Lead notification exception:", notificationError);
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
