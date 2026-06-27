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

function goToPage(pageId) {
  [pageLanguage, pageMain, intakeForm, pageThankyou].forEach(page => {
    if (page) page.hidden = true;
  });

  const target = document.getElementById(pageId);
  if (target) {
    target.hidden = false;
  }
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
    alert("Please select the option that best describes your situation.");
    return false;
  }

  if (profile === "other" && profileOtherInput && !profileOtherInput.value.trim()) {
    alert("Please specify your situation.");
    profileOtherInput.focus();
    return false;
  }

  if (needs.length === 0) {
    alert("Please select at least one area where you need help.");
    return false;
  }

  if (needs.includes("other") && needsOtherInput && !needsOtherInput.value.trim()) {
    alert("Please specify the other type of help you need.");
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
  input.addEventListener("change", toggleProfileOther);
});

// Needs "other"
document.querySelectorAll('input[name="needs"]').forEach(input => {
  input.addEventListener("change", toggleNeedsOther);
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