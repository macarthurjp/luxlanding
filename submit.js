/* =========================================================
   LUXLANDING · SUBMIT.JS
   SUPABASE VERSION
========================================================= */

/* =========================================================
   SUPABASE CONFIG (v2)
========================================================= */

// Migration copies must remain disconnected from production by default.
const MIGRATION_SAFE_MODE = false;

const SUPABASE_URL = "https://itldyciokbtzwufrrifh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0bGR5Y2lva2J0end1ZnJyaWZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MTM5OTMsImV4cCI6MjA5NDA4OTk5M30.GPcmLPH9kkndW3VycqbR6yFoKERiY6URfH4SmpusJUg";
const RECAPTCHA_SITE_KEY = "6Le7tsIsAAAAAPcPGZtFzwO-aZ-CUq11bhyQKIFd";
const SUBMISSION_TIMEOUT_MS = 20000;
const THANK_YOU_RESET_DELAY_MS = 6000;
let activeSubmissionId = null;
let phoneInputInstance = null;
let reviewConfirmed = false;

const DRAFT_STORAGE_KEY = "luxlanding-form-draft-v1";
const ATTRIBUTION_STORAGE_KEY = "luxlanding-attribution-v1";
const SAFE_DRAFT_FIELDS = new Set([
  "profile", "needs", "housing_budget", "housing_bedrooms", "housing_contract",
  "schools_children_count", "schools_type", "admin_job_contract", "admin_address",
  "health_provider", "health_cns", "bank_account", "bank_employed", "moving_help",
  "language_target", "language_level", "job_cv_help", "job_interview",
  "freelancer_register", "freelancer_tax", "move_timing", "support_readiness",
  "contact_method", "contact_time"
]);

function loadRecaptchaScript(baseUrl) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = `${baseUrl}/recaptcha/api.js?render=${encodeURIComponent(RECAPTCHA_SITE_KEY)}`;
    script.async = true;
    script.onload = () => resolve(Boolean(window.grecaptcha));
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
}

const recaptchaReadyPromise = (async () => {
  if (await loadRecaptchaScript("https://www.google.com")) return true;
  return loadRecaptchaScript("https://www.recaptcha.net");
})();

/* =========================================================
   RECAPTCHA V3

   If Google's script is unavailable, getRecaptchaToken() degrades to null;
   the server then rejects the request without storing any lead.
========================================================= */

async function getRecaptchaToken() {
  await Promise.race([
    recaptchaReadyPromise,
    new Promise(resolve => window.setTimeout(() => resolve(false), 10000))
  ]);

  if (!window.grecaptcha) return null;

  return new Promise((resolve) => {
    window.grecaptcha.ready(() => {
      window.grecaptcha
        .execute(RECAPTCHA_SITE_KEY, { action: "submit_lead" })
        .then(resolve)
        .catch(() => resolve(null));
    });
  });
}


/* =========================================================
   HELPERS
========================================================= */

function normalizePhone(phone) {
  const cleaned = String(phone || "").trim().replace(/[^\d+]/g, "");
  return cleaned.startsWith("+") ? `+${cleaned.slice(1).replace(/\+/g, "")}` : cleaned.replace(/\+/g, "");
}

function normalizeEmail(email) {
  return (email || "").trim().toLowerCase();
}

function emptyToNull(value) {
  return value === "" || value === undefined ? null : value;
}

const euroBudgetFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

function parseEuroBudget(value) {
  const text = String(value || "").trim();
  if (!text) return null;
  const numeric = /[,.\s€]/.test(text)
    ? Number(text.replace(/€/g, "").replace(/,/g, "").replace(/\s/g, ""))
    : Number(text.replace(/\D/g, ""));
  return Number.isFinite(numeric) ? Math.round(numeric) : null;
}

function readSessionJson(key) {
  try {
    return JSON.parse(sessionStorage.getItem(key) || "null");
  } catch {
    return null;
  }
}

function captureAttribution() {
  const existing = readSessionJson(ATTRIBUTION_STORAGE_KEY);
  if (existing) return existing;
  const params = new URLSearchParams(window.location.search);
  let externalReferrer = "";
  try {
    externalReferrer = document.referrer && new URL(document.referrer).origin !== window.location.origin
      ? document.referrer.slice(0, 500) : "";
  } catch {
    // Ignore malformed browser referrers.
  }
  const attribution = {
    utm_source: params.get("utm_source") || "",
    utm_medium: params.get("utm_medium") || "",
    utm_campaign: params.get("utm_campaign") || "",
    utm_term: params.get("utm_term") || "",
    utm_content: params.get("utm_content") || "",
    landing_page: `${window.location.origin}${window.location.pathname}`,
    referrer: externalReferrer
  };
  try {
    sessionStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(attribution));
  } catch {
    // Attribution is optional; submissions must continue if storage is unavailable.
  }
  return attribution;
}

const firstTouchAttribution = captureAttribution();

const REVIEW_COPY = {
  en: { profile:"Profile", needs:"Help requested", budget:"Monthly budget", timing:"Move timing", readiness:"Support readiness", method:"Contact method", time:"Best contact time", name:"Name", email:"Email", phone:"Phone", errors:"Please correct the following fields:", confirmEmail:"We’ll reply by email, usually within 24 hours.", confirmWhatsapp:"We’ll contact you by WhatsApp, usually within 24 hours.", confirmPhone:"We’ll call you at your preferred time, usually within 24 hours." },
  fr: { profile:"Profil", needs:"Aide demandée", budget:"Budget mensuel", timing:"Date du déménagement", readiness:"Disponibilité", method:"Mode de contact", time:"Meilleur moment", name:"Nom", email:"E-mail", phone:"Téléphone", errors:"Veuillez corriger les champs suivants :", confirmEmail:"Nous vous répondrons par e-mail, généralement sous 24 heures.", confirmWhatsapp:"Nous vous contacterons par WhatsApp, généralement sous 24 heures.", confirmPhone:"Nous vous appellerons au moment souhaité, généralement sous 24 heures." },
  es: { profile:"Perfil", needs:"Ayuda solicitada", budget:"Presupuesto mensual", timing:"Fecha de mudanza", readiness:"Disposición", method:"Canal de contacto", time:"Mejor horario", name:"Nombre", email:"Correo", phone:"Teléfono", errors:"Corrige los siguientes campos:", confirmEmail:"Te responderemos por correo, normalmente dentro de 24 horas.", confirmWhatsapp:"Te contactaremos por WhatsApp, normalmente dentro de 24 horas.", confirmPhone:"Te llamaremos en el horario indicado, normalmente dentro de 24 horas." },
  pt: { profile:"Perfil", needs:"Ajuda solicitada", budget:"Orçamento mensal", timing:"Data da mudança", readiness:"Disponibilidade", method:"Canal de contacto", time:"Melhor horário", name:"Nome", email:"E-mail", phone:"Telefone", errors:"Corrija os seguintes campos:", confirmEmail:"Responderemos por e-mail, normalmente dentro de 24 horas.", confirmWhatsapp:"Entraremos em contacto por WhatsApp, normalmente dentro de 24 horas.", confirmPhone:"Ligaremos no horário indicado, normalmente dentro de 24 horas." }
};

const FORM_UI_COPY = {
  en: {
    invalid: "Please review the highlighted field before sending your request.",
    migration: "Preview mode: submissions are disabled until the production connection is configured.",
    sending: "Sending…",
    rejected: "We couldn't send your request. Please review your details and try again.",
    security: "Security verification could not be completed. Reload the page and try again.",
    rateLimit: "Too many requests were sent. Please wait one hour and try again.",
    network: "We couldn't connect. Check your internet connection and try again.",
    timeout: "The request took too long. Please try again.",
    invalidPhone: "Enter a valid phone number for the selected country."
  },
  fr: {
    invalid: "Veuillez vérifier le champ indiqué avant d’envoyer votre demande.",
    migration: "Mode aperçu : les envois sont désactivés jusqu’à la configuration de la connexion de production.",
    sending: "Envoi…",
    rejected: "Nous n'avons pas pu envoyer votre demande. Vérifiez vos informations et réessayez.",
    security: "La vérification de sécurité n’a pas pu aboutir. Rechargez la page et réessayez.",
    rateLimit: "Trop de demandes ont été envoyées. Patientez une heure avant de réessayer.",
    network: "Connexion impossible. Vérifiez votre connexion internet et réessayez.",
    timeout: "La demande a pris trop de temps. Veuillez réessayer.",
    invalidPhone: "Saisissez un numéro valide pour le pays sélectionné."
  },
  es: {
    invalid: "Revisa el campo indicado antes de enviar tu solicitud.",
    migration: "Modo de vista previa: los envíos están desactivados hasta configurar la conexión de producción.",
    sending: "Enviando…",
    rejected: "No pudimos enviar tu solicitud. Revisa tus datos e inténtalo de nuevo.",
    security: "No se pudo completar la verificación de seguridad. Recarga la página e inténtalo de nuevo.",
    rateLimit: "Se enviaron demasiadas solicitudes. Espera una hora antes de intentarlo de nuevo.",
    network: "No pudimos conectar. Revisa tu conexión a internet e inténtalo de nuevo.",
    timeout: "La solicitud tardó demasiado. Inténtalo de nuevo.",
    invalidPhone: "Introduce un número válido para el país seleccionado."
  },
  pt: {
    invalid: "Verifique o campo indicado antes de enviar o pedido.",
    migration: "Modo de pré-visualização: os envios estão desativados até configurar a ligação de produção.",
    sending: "A enviar…",
    rejected: "Não foi possível enviar o pedido. Verifique os seus dados e tente novamente.",
    security: "Não foi possível concluir a verificação de segurança. Recarregue a página e tente novamente.",
    rateLimit: "Foram enviados demasiados pedidos. Aguarde uma hora antes de tentar novamente.",
    network: "Não foi possível ligar. Verifique a sua ligação à internet e tente novamente.",
    timeout: "O pedido demorou demasiado. Tente novamente.",
    invalidPhone: "Introduza um número válido para o país selecionado."
  }
};

function getFormUiCopy(lang) {
  return FORM_UI_COPY[String(lang || "en").toLowerCase()] || FORM_UI_COPY.en;
}

function getReviewCopy(lang) {
  return REVIEW_COPY[String(lang || "en").toLowerCase()] || REVIEW_COPY.en;
}

function getFieldLabel(field) {
  const fieldsetLabel = field.closest("fieldset")?.querySelector("legend")?.textContent?.trim();
  if (fieldsetLabel) return fieldsetLabel;
  const explicitLabel = field.id ? document.querySelector(`label[for="${field.id}"]`) : null;
  const label = explicitLabel || field.closest("label");
  return label?.querySelector("span")?.textContent?.trim() || label?.textContent?.trim() || field.name || "Field";
}

function showErrorSummary(form, lang) {
  const summary = document.getElementById("form-error-summary");
  if (!summary) return;
  const seen = new Set();
  const invalidFields = [...form.elements].filter(field => {
    if (!field?.validity || field.validity.valid || field.disabled) return false;
    const key = field.name || field.id;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  if (!invalidFields.length) {
    summary.hidden = true;
    summary.replaceChildren();
    return;
  }

  const heading = document.createElement("strong");
  heading.textContent = getReviewCopy(lang).errors;
  const list = document.createElement("ul");
  invalidFields.forEach((field, index) => {
    if (!field.id) field.id = `form-field-${index + 1}`;
    const item = document.createElement("li");
    const link = document.createElement("a");
    link.href = `#${field.id}`;
    link.textContent = getFieldLabel(field);
    link.addEventListener("click", event => {
      event.preventDefault();
      field.focus();
      field.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    item.appendChild(link);
    list.appendChild(item);
  });
  summary.replaceChildren(heading, list);
  summary.hidden = false;
  summary.focus({ preventScroll: true });
}

function selectedText(selector) {
  const element = document.querySelector(selector);
  if (!element) return "";
  if (element.matches("select")) return element.selectedOptions?.[0]?.textContent?.trim() || "";
  return element.closest("label")?.querySelector("span")?.textContent?.trim() || element.value || "";
}

function showReviewPanel(form, lang) {
  const panel = document.getElementById("review-panel");
  const summary = document.getElementById("review-summary");
  const submitButton = document.getElementById("submit-lead-button");
  if (!panel || !summary) return;
  const copy = getReviewCopy(lang);
  const needs = [...document.querySelectorAll('input[name="needs"]:checked')]
    .map(input => input.closest("label")?.querySelector("span")?.textContent?.trim())
    .filter(Boolean).join(", ");
  const phoneInput = form.querySelector('input[name="contact_phone"]');
  const phone = phoneInput?.value.trim() && phoneInputInstance ? phoneInputInstance.getNumber() : "";
  const rows = [
    [copy.profile, selectedText('input[name="profile"]:checked')],
    [copy.needs, needs],
    [copy.budget, document.getElementById("housing-budget-display")?.value],
    [copy.timing, selectedText('select[name="move_timing"]')],
    [copy.readiness, selectedText('select[name="support_readiness"]')],
    [copy.method, selectedText('input[name="contact_method"]:checked')],
    [copy.time, selectedText('select[name="contact_time"]')],
    [copy.name, form.elements.contact_name?.value],
    [copy.email, form.elements.contact_email?.value],
    [copy.phone, phone]
  ].filter(([, value]) => String(value || "").trim());

  summary.replaceChildren(...rows.flatMap(([label, value]) => {
    const term = document.createElement("dt");
    const detail = document.createElement("dd");
    term.textContent = label;
    detail.textContent = String(value);
    return [term, detail];
  }));
  panel.hidden = false;
  if (submitButton) submitButton.hidden = true;
  panel.scrollIntoView({ behavior: "smooth", block: "start" });
  document.getElementById("review-title")?.focus?.({ preventScroll: true });
}

function saveSafeDraft(form) {
  const draft = { language: window.currentLang || "en", values: {} };
  SAFE_DRAFT_FIELDS.forEach(name => {
    const fields = [...form.querySelectorAll(`[name="${name}"]`), ...document.querySelectorAll(`#page-main [name="${name}"]`)];
    if (!fields.length) return;
    if (fields[0].type === "checkbox") draft.values[name] = fields.filter(field => field.checked).map(field => field.value);
    else if (fields[0].type === "radio") draft.values[name] = fields.find(field => field.checked)?.value || "";
    else draft.values[name] = fields[0].value || "";
  });
  try {
    sessionStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
  } catch {
    // Draft recovery is progressive enhancement only.
  }
}

function restoreSafeDraft(form) {
  const draft = readSessionJson(DRAFT_STORAGE_KEY);
  if (!draft?.values) return;
  if (draft.language && typeof window.applyLanguage === "function") window.applyLanguage(draft.language);
  Object.entries(draft.values).forEach(([name, value]) => {
    const fields = [...form.querySelectorAll(`[name="${name}"]`), ...document.querySelectorAll(`#page-main [name="${name}"]`)];
    fields.forEach(field => {
      if (field.type === "checkbox") field.checked = Array.isArray(value) && value.includes(field.value);
      else if (field.type === "radio") field.checked = field.value === value;
      else field.value = String(value || "");
    });
  });
}

function setFormStatus(message = "", type = "info") {
  const status = document.getElementById("form-status");
  if (!status) return;
  status.textContent = message;
  status.hidden = !message;
  status.classList.toggle("form-message-error", type === "error");
  status.classList.toggle("form-message-success", type === "success");
  status.setAttribute("role", type === "error" ? "alert" : "status");
  if (message) status.focus({ preventScroll: true });
}

function setSubmitting(isSubmitting, lang) {
  const button = document.getElementById("submit-lead-button");
  const confirmButton = document.getElementById("review-confirm");
  const label = button?.querySelector("[data-i18n='form.review']");
  if (!button) return;
  button.disabled = isSubmitting;
  if (confirmButton) {
    confirmButton.disabled = isSubmitting;
    const dict = window.translations?.[window.currentLang] || window.translations?.en;
    confirmButton.textContent = isSubmitting ? getFormUiCopy(lang).sending : (dict?.["review.confirm"] || "Confirm and send");
  }
  button.classList.toggle("is-loading", isSubmitting);
  button.setAttribute("aria-busy", String(isSubmitting));
  if (label) {
    const dict = window.translations?.[window.currentLang] || window.translations?.en;
    label.textContent = dict?.["form.review"] || "Review request";
  }
}
/* =========================================================
   FORM SUBMISSION

   The leads table must not accept a direct anon INSERT —
   that would let a bot bypass reCAPTCHA entirely by calling the
   REST API directly. The insert now happens inside the submit-lead
   Edge Function, which verifies the reCAPTCHA token server-side
   (with the secret key, never exposed to the browser) before
   writing anything.
========================================================= */

async function submitLead(event) {
  event.preventDefault();

  const form = event.target;
  const lang = String(window.currentLang || document.documentElement.lang || "en").toLowerCase();
  setFormStatus();
  form.querySelectorAll("[aria-invalid='true']").forEach(field => field.removeAttribute("aria-invalid"));

  const phoneInput = form.querySelector('input[name="contact_phone"]');
  const contactMethod = form.querySelector('input[name="contact_method"]:checked')?.value || "";
  const phoneRequired = contactMethod === "whatsapp" || contactMethod === "phone";
  phoneInput?.setCustomValidity(phoneRequired && !phoneInput.value.trim() ? getFormUiCopy(lang).invalidPhone : "");
  if (phoneInput?.value.trim() && phoneInputInstance) {
    await phoneInputInstance.promise.catch(() => undefined);
    if (!phoneInputInstance.isValidNumber()) {
      const message = getFormUiCopy(lang).invalidPhone;
      phoneInput.setCustomValidity(message);
      phoneInput.setAttribute("aria-invalid", "true");
      const phoneError = document.getElementById("contact-phone-error");
      if (phoneError) {
        phoneError.textContent = message;
        phoneError.hidden = false;
      }
    }
  }

  if (!form.checkValidity()) {
    const invalidField = form.querySelector(":invalid");
    invalidField?.setAttribute("aria-invalid", "true");
    setFormStatus(getFormUiCopy(lang).invalid, "error");
    showErrorSummary(form, lang);
    invalidField?.focus({ preventScroll: true });
    return;
  }

  document.getElementById("form-error-summary")?.setAttribute("hidden", "");

  if (!reviewConfirmed) {
    showReviewPanel(form, lang);
    return;
  }
  reviewConfirmed = false;

  if (MIGRATION_SAFE_MODE) {
    setFormStatus(getFormUiCopy(lang).migration, "info");
    return;
  }

  setSubmitting(true, lang);
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
  formData.contact_phone = phoneInput?.value.trim() && phoneInputInstance
    ? phoneInputInstance.getNumber()
    : normalizePhone(formData.contact_phone);
  formData.housing_budget = emptyToNull(formData.housing_budget);
  Object.assign(formData, firstTouchAttribution, {
    client_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || ""
  });

  let submitResult;
  const submissionId = activeSubmissionId || crypto.randomUUID();
  activeSubmissionId = submissionId;
  const requestController = new AbortController();
  const requestTimeout = window.setTimeout(() => requestController.abort(), SUBMISSION_TIMEOUT_MS);
  try {
    let submitResponse;
    for (let attempt = 0; attempt < 2; attempt += 1) {
      const recaptchaToken = await getRecaptchaToken();
      submitResponse = await fetch(
        `${SUPABASE_URL}/functions/v1/submit-lead`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "apikey": SUPABASE_ANON_KEY,
            "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
          },
          signal: requestController.signal,
          body: JSON.stringify({ submissionId, lead: formData, recaptchaToken })
        }
      );

      submitResult = await submitResponse.json().catch(() => ({}));
      if (submitResponse.ok || !submitResult.retryable || attempt === 1) break;
      await new Promise(resolve => window.setTimeout(resolve, 600));
    }

    if (!submitResponse.ok) {
      const responseError = new Error("submission-rejected");
      responseError.name = submitResponse.status === 403
        ? "SecurityError"
        : submitResponse.status === 429 ? "RateLimitError" : "SubmissionError";
      throw responseError;
    }
  } catch (submitError) {
    console.error(submitError);
    const copy = getFormUiCopy(lang);
    const message = submitError?.name === "AbortError"
      ? copy.timeout
      : submitError?.name === "SecurityError" ? copy.security
      : submitError?.name === "RateLimitError" ? copy.rateLimit
      : submitError?.name === "SubmissionError" ? copy.rejected : copy.network;
    setFormStatus(message, "error");
    return;
  } finally {
    window.clearTimeout(requestTimeout);
    setSubmitting(false, lang);
  }

  // Fired only after the server confirms the lead was actually written —
  // a client-side-only event here would count requests that reCAPTCHA or
  // validation later rejected as conversions.
  if (typeof gtag === "function") {
    gtag("event", "generate_lead", {
      lead_id: submitResult.lead_id,
      profile: formData.profile,
      needs: formData.needs,
      lead_score: submitResult.lead_score,
      lead_status: submitResult.lead_status,
      language: formData.language
    });
  }

  const confirmation = document.getElementById("thank-contact-method");
  if (confirmation) {
    const reviewCopy = getReviewCopy(lang);
    confirmation.textContent = formData.contact_method === "whatsapp"
      ? reviewCopy.confirmWhatsapp
      : formData.contact_method === "phone" ? reviewCopy.confirmPhone : reviewCopy.confirmEmail;
  }

  try {
    sessionStorage.removeItem(DRAFT_STORAGE_KEY);
  } catch {
    // The submission already succeeded; storage cleanup is non-critical.
  }

  form.reset();
  activeSubmissionId = null;

  const referenceValue = document.getElementById("thank-reference-value");
  if (referenceValue) {
    const referenceSource = String(submitResult.lead_id || submissionId).replace(/-/g, "");
    referenceValue.textContent = `LL-${referenceSource.slice(0, 8).toUpperCase()}`;
  }

  const thankYouPage = document.getElementById("page-thankyou");
  const intakeForm = document.getElementById("intake-form");
  const formContainer = document.getElementById("form-container");

  if (typeof window.goToPage === "function") {
    window.goToPage("page-thankyou");
  } else {
    if (intakeForm) intakeForm.hidden = true;
    if (thankYouPage) thankYouPage.hidden = false;
  }

  if (formContainer) {
    formContainer.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // Keep the confirmation visible long enough to read the reference, then
  // return to a pristine form. replace() prevents Back from restoring the
  // completed confirmation state.
  window.setTimeout(() => {
    window.location.replace(window.location.pathname);
  }, THANK_YOU_RESET_DELAY_MS);
}

/* =========================================================
   INIT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#intake-form");
  const phoneInput = form?.querySelector('input[name="contact_phone"]');
  const budgetDisplay = document.getElementById("housing-budget-display");
  const budgetValue = document.getElementById("housing-budget-value");

  if (form) restoreSafeDraft(form);

  if (budgetDisplay && budgetValue) {
    const syncBudget = () => {
      const amount = parseEuroBudget(budgetDisplay.value);
      const valid = amount === null || (amount >= 0 && amount <= 100000);
      budgetValue.value = valid && amount !== null ? String(amount) : "";
      budgetDisplay.setCustomValidity(valid ? "" : "Enter a monthly budget of €100,000 or less.");
      return valid ? amount : null;
    };

    budgetDisplay.addEventListener("focus", () => {
      budgetDisplay.value = budgetValue.value;
    });
    budgetDisplay.addEventListener("input", () => {
      const formattedAmount = /[€,.]/.test(budgetDisplay.value) ? parseEuroBudget(budgetDisplay.value) : null;
      budgetDisplay.value = formattedAmount !== null
        ? String(formattedAmount)
        : budgetDisplay.value.replace(/[^0-9]/g, "").slice(0, 6);
      syncBudget();
      if (form) saveSafeDraft(form);
    });
    budgetDisplay.addEventListener("blur", () => {
      const amount = syncBudget();
      budgetDisplay.value = amount === null ? "" : euroBudgetFormatter.format(amount);
      if (form) saveSafeDraft(form);
    });
    if (budgetValue.value) budgetDisplay.value = euroBudgetFormatter.format(Number(budgetValue.value));
  }

  if (phoneInput && typeof window.intlTelInput === "function") {
    const browserRegion = String(navigator.language || "").split("-")[1]?.toLowerCase();
    const supportedRegions = new Set(window.intlTelInput.getAllCountries().map(country => country.iso2));
    const regionalDefaults = new Set(["lu", "fr", "be", "de", "pt"]);
    const initialCountry = browserRegion && supportedRegions.has(browserRegion) && regionalDefaults.has(browserRegion)
      ? browserRegion
      : "lu";
    phoneInputInstance = window.intlTelInput(phoneInput, {
      initialCountry,
      countryOrder: ["lu", "fr", "be", "de", "pt"],
      separateDialCode: true,
      strictMode: true,
      formatAsYouType: true,
      loadUtils: () => import("./vendor/intl-tel-input/utils.js")
    });

    const clearPhoneError = () => {
      phoneInput.setCustomValidity("");
      phoneInput.removeAttribute("aria-invalid");
      const phoneError = document.getElementById("contact-phone-error");
      if (phoneError) {
        phoneError.textContent = "";
        phoneError.hidden = true;
      }
    };
    phoneInput.addEventListener("input", clearPhoneError);
    phoneInput.addEventListener("countrychange", clearPhoneError);
  }

  if (form) {
    form.addEventListener("submit", submitLead);
    form.addEventListener("input", event => {
      event.target?.removeAttribute?.("aria-invalid");
      setFormStatus();
      reviewConfirmed = false;
      const reviewPanel = document.getElementById("review-panel");
      const submitButton = document.getElementById("submit-lead-button");
      if (reviewPanel && !reviewPanel.hidden) {
        reviewPanel.hidden = true;
        if (submitButton) submitButton.hidden = false;
      }
    });

    document.addEventListener("change", event => {
      if (event.target?.name && SAFE_DRAFT_FIELDS.has(event.target.name)) saveSafeDraft(form);
    });

    document.getElementById("review-edit")?.addEventListener("click", () => {
      reviewConfirmed = false;
      document.getElementById("review-panel").hidden = true;
      document.getElementById("submit-lead-button").hidden = false;
      document.getElementById("block-contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    document.getElementById("review-confirm")?.addEventListener("click", () => {
      reviewConfirmed = true;
      form.requestSubmit();
    });
  }
});
