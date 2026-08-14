window.currentLang = window.currentLang || "en";
window.selectedNeeds = window.selectedNeeds || [];

/* =========================================================
   GA4 CONVERSION TRACKING
========================================================= */

function trackEvent(name, params = {}) {
  if (typeof gtag === "function") {
    gtag("event", name, params);
  }
}

const pageLanguage = document.getElementById("page-language");
const pageMain = document.getElementById("page-main");
const intakeForm = document.getElementById("intake-form");
const pageThankyou = document.getElementById("page-thankyou");

const btnMainNext = document.getElementById("btn-main-next");
const langButtons = document.querySelectorAll(".btn-lang");
const backButtons = document.querySelectorAll(".btn-back");

const profileOtherWrap = document.getElementById("profile-other-wrap");
const profileOtherInput = document.getElementById("profile-other-input");
const needsOtherWrap = document.getElementById("needs-other-wrap");
const needsOtherInput = document.getElementById("needs-other-input");
const mainFormMessage = document.getElementById("main-form-message");
const progressStatus = document.getElementById("form-progress-status");

const VALIDATION_MESSAGES = {
  en: {
    profile: "Please select the option that best describes your situation.",
    profileOther: "Please specify your situation.",
    needs: "Please select at least one area where you need help.",
    needsOther: "Please specify the other type of help you need.",
    progress: step => `Step ${step} of 3`,
    remaining: step => step === 1 ? "About 2 minutes remaining" : step === 2 ? "About 1 minute remaining" : "Final step",
    progressLabel: "Form progress"
  },
  fr: {
    profile: "Veuillez sélectionner l’option qui décrit le mieux votre situation.",
    profileOther: "Veuillez préciser votre situation.",
    needs: "Veuillez sélectionner au moins un domaine dans lequel vous avez besoin d’aide.",
    needsOther: "Veuillez préciser l’autre type d’aide souhaité.",
    progress: step => `Étape ${step} sur 3`,
    remaining: step => step === 1 ? "Environ 2 minutes restantes" : step === 2 ? "Environ 1 minute restante" : "Dernière étape",
    progressLabel: "Progression du formulaire"
  },
  es: {
    profile: "Selecciona la opción que mejor describe tu situación.",
    profileOther: "Especifica tu situación.",
    needs: "Selecciona al menos un área en la que necesitas ayuda.",
    needsOther: "Especifica el otro tipo de ayuda que necesitas.",
    progress: step => `Paso ${step} de 3`,
    remaining: step => step === 1 ? "Aproximadamente 2 minutos" : step === 2 ? "Aproximadamente 1 minuto" : "Paso final",
    progressLabel: "Progreso del formulario"
  },
  pt: {
    profile: "Selecione a opção que melhor descreve a sua situação.",
    profileOther: "Especifique a sua situação.",
    needs: "Selecione pelo menos uma área em que precisa de ajuda.",
    needsOther: "Especifique o outro tipo de ajuda de que necessita.",
    progress: step => `Etapa ${step} de 3`,
    remaining: step => step === 1 ? "Cerca de 2 minutos restantes" : step === 2 ? "Cerca de 1 minuto restante" : "Etapa final",
    progressLabel: "Progresso do formulário"
  }
};

const NEED_BLOCK_MAP = {
  housing: "block-housing",
  admin: "block-admin",
  schools: "block-schools",
  health: "block-health",
  banking: "block-banking",
  moving: "block-moving",
  language: "block-language",
  job: "block-job",
  freelancer: "block-freelancer"
};

const ALWAYS_SHOW_BLOCKS = ["block-context", "block-final", "block-contact"];

function getValidationCopy() {
  return VALIDATION_MESSAGES[window.currentLang] || VALIDATION_MESSAGES.en;
}

function setMainMessage(message = "") {
  if (!mainFormMessage) return;
  mainFormMessage.textContent = message;
  mainFormMessage.hidden = !message;
  if (message) mainFormMessage.focus({ preventScroll: true });
}

function updateProgress(pageId) {
  const step = pageId === "page-language" ? 1 : pageId === "page-main" ? 2 : 3;
  const isComplete = pageId === "page-thankyou";
  const steps = document.querySelectorAll("[data-progress-step]");
  const lines = document.querySelectorAll(".progress-line");
  const progress = document.getElementById("form-progress");

  steps.forEach((element, index) => {
    const number = index + 1;
    element.classList.toggle("active", !isComplete && number === step);
    element.classList.toggle("completed", isComplete || number < step);
    element.removeAttribute("aria-current");
    if (!isComplete && number === step) element.setAttribute("aria-current", "step");
  });

  lines.forEach((line, index) => {
    line.classList.toggle("active", isComplete || index + 1 < step);
  });

  if (progressStatus) {
    progressStatus.textContent = isComplete ? "" : `${getValidationCopy().progress(step)} · ${getValidationCopy().remaining(step)}`;
  }
  if (progress) progress.setAttribute("aria-label", getValidationCopy().progressLabel);
}

function goToPage(pageId) {
  [pageLanguage, pageMain, intakeForm, pageThankyou].forEach(page => {
    if (page) page.hidden = true;
  });

  const target = document.getElementById(pageId);
  if (target) {
    target.hidden = false;
  }
  updateProgress(pageId);
  setMainMessage();
}

function scrollToFormSafe() {
  const leadForm = document.getElementById("lead-form");
  if (leadForm) {
    leadForm.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function scrollToTopSafe() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function getSelectedProfile() {
  const selected = document.querySelector('input[name="profile"]:checked');
  return selected ? selected.value : null;
}

function getSelectedNeeds() {
  return Array.from(document.querySelectorAll('input[name="needs"]:checked')).map(el => el.value);
}

function toggleProfileOther() {
  const show = getSelectedProfile() === "other";

  if (profileOtherWrap) {
    profileOtherWrap.hidden = !show;
  }

  if (profileOtherInput) {
    profileOtherInput.required = show;
    if (!show) profileOtherInput.value = "";
  }
}

function toggleNeedsOther() {
  const needs = getSelectedNeeds();
  const show = needs.includes("other");

  if (needsOtherWrap) {
    needsOtherWrap.hidden = !show;
  }

  if (needsOtherInput) {
    needsOtherInput.required = show;
    if (!show) needsOtherInput.value = "";
  }
}

function hideAllBlocks() {
  document.querySelectorAll("#intake-form .block").forEach(block => {
    block.hidden = true;
  });
}

function showSelectedBlocks() {
  hideAllBlocks();

  window.selectedNeeds.forEach(need => {
    const blockId = NEED_BLOCK_MAP[need];
    if (!blockId) return;

    const block = document.getElementById(blockId);
    if (block) {
      block.hidden = false;
    }
  });

  ALWAYS_SHOW_BLOCKS.forEach(blockId => {
    const block = document.getElementById(blockId);
    if (block) {
      block.hidden = false;
    }
  });
}

function validateMainPage() {
  const profile = getSelectedProfile();
  const needs = getSelectedNeeds();

  if (!profile) {
    setMainMessage(getValidationCopy().profile);
    return false;
  }

  if (profile === "other" && profileOtherInput && !profileOtherInput.value.trim()) {
    setMainMessage(getValidationCopy().profileOther);
    profileOtherInput.focus();
    return false;
  }

  if (needs.length === 0) {
    setMainMessage(getValidationCopy().needs);
    return false;
  }

  if (needs.includes("other") && needsOtherInput && !needsOtherInput.value.trim()) {
    setMainMessage(getValidationCopy().needsOther);
    needsOtherInput.focus();
    return false;
  }

  return true;
}

function applySelectedLanguage(lang) {
  window.currentLang = lang;

  if (typeof window.applyLanguage === "function") {
    window.applyLanguage(lang);
  }
}

// Language buttons
langButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const lang = btn.dataset.lang || "en";
    applySelectedLanguage(lang);
    trackEvent("form_start", { form_name: "lead_intake", language: lang });
    goToPage("page-main");
    scrollToFormSafe();
  });
});

// Profile "other"
document.querySelectorAll('input[name="profile"]').forEach(input => {
  input.addEventListener("change", () => {
    toggleProfileOther();
    setMainMessage();
  });
});

// Needs "other"
document.querySelectorAll('input[name="needs"]').forEach(input => {
  input.addEventListener("change", () => {
    toggleNeedsOther();
    setMainMessage();
  });
});

[profileOtherInput, needsOtherInput].forEach(input => {
  input?.addEventListener("input", () => setMainMessage());
});

// Main next
if (btnMainNext) {
  btnMainNext.addEventListener("click", () => {
    if (!validateMainPage()) return;

    window.selectedNeeds = getSelectedNeeds();
    showSelectedBlocks();
    trackEvent("form_profile_completed", {
      form_name: "lead_intake",
      profile: getSelectedProfile(),
      needs: window.selectedNeeds.join(",")
    });
    goToPage("intake-form");
    scrollToFormSafe();
  });
}

// Back buttons
backButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    if (pageThankyou && !pageThankyou.hidden) {
      goToPage("page-main");
      scrollToFormSafe();
      return;
    }

    if (intakeForm && !intakeForm.hidden) {
      goToPage("page-main");
      scrollToFormSafe();
      return;
    }

    if (pageMain && !pageMain.hidden) {
      goToPage("page-language");
      scrollToFormSafe();
    }
  });
});

// Init
toggleProfileOther();
toggleNeedsOther();
goToPage("page-language");

// Expose helpers for submit.js
window.goToPage = goToPage;
window.scrollToFormSafe = scrollToFormSafe;
window.scrollToTopSafe = scrollToTopSafe;
