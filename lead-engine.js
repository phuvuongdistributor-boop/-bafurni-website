(() => {
  const dialog = document.querySelector("#quote-wizard");
  const form = document.querySelector("#quote-form");
  if (!dialog || !form) return;

  const config = window.BA_LEAD_CONFIG || {};
  const closeButtons = dialog.querySelectorAll("[data-close-wizard]");
  const steps = [...dialog.querySelectorAll("[data-step]")];
  const progress = [...dialog.querySelectorAll("[data-progress]")];
  const choiceButtons = [...dialog.querySelectorAll(".v7-choice")];
  const successPanel = dialog.querySelector("[data-wizard-success]");
  const hiddenNeed = form.elements.need_type;
  let currentStep = 1;
  let lastTrigger = null;

  function contextualFields() {
    return ["source", "source_page", "product_code", "product_name", "category_name"].reduce((context, name) => {
      const field = form.elements.namedItem(name);
      if (field && String(field.value || "").trim()) context[name] = String(field.value).trim();
      return context;
    }, {});
  }

  function pushEvent(event, details = {}) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...details });
  }

  function openWizard(event) {
    lastTrigger = event?.target?.closest?.("[data-open-wizard]") || event?.currentTarget || document.activeElement;
    resetWizard();
    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
    document.body.classList.add("wizard-open");
    pushEvent("quote_wizard_open", { source: lastTrigger?.textContent?.trim().slice(0, 60) || "unknown" });
    requestAnimationFrame(() => choiceButtons[0]?.focus());
  }

  function closeWizard() {
    if (typeof dialog.close === "function") {
      dialog.close();
    } else {
      dialog.removeAttribute("open");
    }
    document.body.classList.remove("wizard-open");
    lastTrigger?.focus?.();
  }

  function showStep(stepNumber) {
    currentStep = stepNumber;
    steps.forEach((step) => {
      const active = Number(step.dataset.step) === stepNumber;
      step.hidden = !active;
      step.classList.toggle("is-active", active);
    });
    progress.forEach((item) => {
      item.classList.toggle("is-active", Number(item.dataset.progress) <= stepNumber);
    });
    const heading = dialog.querySelector(`[data-step="${stepNumber}"] h3`);
    requestAnimationFrame(() => heading?.focus?.());
    pushEvent("quote_wizard_step", { step: stepNumber });
  }

  function clearErrors() {
    dialog.querySelectorAll("[data-error]").forEach((item) => {
      item.textContent = "";
    });
  }

  function resetWizard() {
    form.reset();
    hiddenNeed.value = "";
    choiceButtons.forEach((button) => button.classList.remove("is-selected"));
    successPanel.hidden = true;
    steps.forEach((step) => {
      step.hidden = Number(step.dataset.step) !== 1;
    });
    progress.forEach((item) => {
      item.classList.toggle("is-active", Number(item.dataset.progress) === 1);
    });
    form.querySelectorAll("button").forEach((button) => {
      button.disabled = false;
    });
    clearErrors();
    currentStep = 1;
  }

  function validateStepTwo() {
    const required = [...form.querySelectorAll('[data-step="2"] [required]')];
    const invalid = required.find((field) => !field.checkValidity());
    const error = dialog.querySelector('[data-error="step2"]');
    if (invalid) {
      error.textContent = "Vui lòng hoàn thành các thông tin bắt buộc.";
      invalid.focus();
      return false;
    }
    error.textContent = "";
    return true;
  }

  function normalizePhone(value) {
    return String(value || "").replace(/[^\d+]/g, "");
  }

  function calculateLeadScore(data) {
    const scoreMap = {
      need_type: { office: 16, school: 14, factory: 18, project: 20 },
      org_type: { business: 10, contractor: 12, school: 8, individual: 2 },
      quantity: { under10: 3, "10-29": 8, "30-99": 14, "100plus": 20 },
      timeline: { "30days": 20, "1-3months": 14, "3plus": 7, researching: 2 },
      budget: { unknown: 5, under50: 4, "50-200": 10, "200-500": 15, "500plus": 20 }
    };
    let score = Object.entries(scoreMap).reduce((total, [field, options]) => {
      return total + (options[data[field]] || 0);
    }, 0);
    const priorityRegions = ["nam định", "ninh bình", "hà nam", "hưng yên", "thái bình"];
    const normalizedRegion = String(data.region || "").trim().toLocaleLowerCase("vi");
    score += priorityRegions.some((region) => normalizedRegion.includes(region)) ? 10 : 6;
    score = Math.min(score, 100);
    return {
      score,
      tier: score >= 60 ? "HOT" : score >= 38 ? "WARM" : "NEW"
    };
  }

  function getAttribution() {
    const params = new URLSearchParams(window.location.search);
    return {
      page_url: window.location.href,
      page_title: document.title,
      referrer: document.referrer,
      utm_source: params.get("utm_source") || "",
      utm_medium: params.get("utm_medium") || "",
      utm_campaign: params.get("utm_campaign") || "",
      utm_content: params.get("utm_content") || ""
    };
  }

  async function deliverLead(payload) {
    if (config.demoMode) {
      const existing = JSON.parse(localStorage.getItem("ba_demo_leads") || "[]");
      existing.push(payload);
      localStorage.setItem("ba_demo_leads", JSON.stringify(existing.slice(-20)));
      return { demo: true };
    }

    if (!config.endpoint) {
      throw new Error("LEAD_ENDPOINT_NOT_CONFIGURED");
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), config.timeoutMs || 10000);
    try {
      const request = {
        method: "POST",
        body: JSON.stringify(payload),
        keepalive: true,
        signal: controller.signal,
        headers: { "Content-Type": "text/plain;charset=utf-8" }
      };
      if (config.transport === "no-cors") request.mode = "no-cors";
      const response = await fetch(config.endpoint, request);
      if (config.transport !== "no-cors" && !response.ok) {
        throw new Error(`LEAD_ENDPOINT_${response.status}`);
      }
      return { demo: false };
    } finally {
      clearTimeout(timer);
    }
  }

  function showSuccess(score, data) {
    steps.forEach((step) => {
      step.hidden = true;
    });
    successPanel.hidden = false;
    progress.forEach((item) => item.classList.add("is-active"));
    pushEvent("generate_lead", { lead_tier: score.tier, lead_score: score.score, need_type: data.need_type });
    successPanel.querySelector("button")?.focus();
  }

  document.addEventListener("click", (event) => {
    if (event.target?.closest?.("[data-open-wizard]")) openWizard(event);
  });
  closeButtons.forEach((button) => button.addEventListener("click", closeWizard));

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) closeWizard();
  });

  dialog.addEventListener("close", () => {
    document.body.classList.remove("wizard-open");
  });

  choiceButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const value = button.dataset.value || "";
      hiddenNeed.value = value;
      choiceButtons.forEach((item) => item.classList.toggle("is-selected", item === button));
      dialog.querySelector('[data-error="need_type"]').textContent = "";
      pushEvent("quote_need_selected", { need_type: value });
      showStep(2);
    });
  });

  dialog.querySelectorAll("[data-next-step]").forEach((button) => {
    button.addEventListener("click", () => {
      if (currentStep === 2 && !validateStepTwo()) return;
      showStep(Math.min(3, currentStep + 1));
    });
  });

  dialog.querySelectorAll("[data-prev-step]").forEach((button) => {
    button.addEventListener("click", () => {
      showStep(Math.max(1, currentStep - 1));
    });
  });

  const quickSubmit = dialog.querySelector("[data-quick-submit]");
  quickSubmit?.addEventListener("click", async () => {
    const quickPhone = normalizePhone(form.elements.quick_phone.value);
    const quickError = dialog.querySelector('[data-error="quick"]');
    if (!/^(?:\+?84|0)\d{9,10}$/.test(quickPhone)) {
      quickError.textContent = "Vui lòng nhập số điện thoại hợp lệ.";
      form.elements.quick_phone.focus();
      return;
    }

    quickError.textContent = "";
    const data = {
      name: "Khách cần gọi lại",
      phone: quickPhone,
      need_type: "callback",
      org_type: "",
      quantity: "",
      timeline: "",
      budget: "unknown",
      region: "",
      company: "",
      note: "Yêu cầu gọi lại nhanh từ sticky CTA",
      consent: "callback_request",
      ...contextualFields(),
      submitted_at: new Date().toISOString(),
      ...getAttribution()
    };
    const score = calculateLeadScore(data);
    data.lead_score = score.score;
    data.lead_tier = score.tier;
    quickSubmit.disabled = true;
    quickSubmit.textContent = "Đang gửi...";

    try {
      await deliverLead(data);
      showSuccess(score, data);
    } catch (error) {
      quickError.textContent = "Chưa thể gửi tự động. Vui lòng gọi 0929.878.666 để được hỗ trợ ngay.";
      quickSubmit.disabled = false;
      quickSubmit.textContent = "Gửi lại";
      pushEvent("quote_submit_error", { reason: error?.message || "unknown", flow: "quick" });
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearErrors();

    if (!form.checkValidity()) {
      dialog.querySelector('[data-error="submit"]').textContent = "Vui lòng hoàn thành thông tin và xác nhận đồng ý liên hệ.";
      form.querySelector(":invalid")?.focus();
      return;
    }

    const data = Object.fromEntries(new FormData(form).entries());
    const phone = normalizePhone(data.phone);
    if (!/^(?:\+?84|0)\d{9,10}$/.test(phone)) {
      dialog.querySelector('[data-error="submit"]').textContent = "Số điện thoại chưa đúng định dạng.";
      form.elements.phone.focus();
      return;
    }

    const score = calculateLeadScore(data);
    form.elements.lead_score.value = String(score.score);
    form.elements.lead_tier.value = score.tier;
    data.phone = phone;
    data.lead_score = score.score;
    data.lead_tier = score.tier;
    data.submitted_at = new Date().toISOString();
    Object.assign(data, getAttribution());

    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = "Đang gửi...";

    try {
      await deliverLead(data);
      showSuccess(score, data);
    } catch (error) {
      dialog.querySelector('[data-error="submit"]').textContent =
        "Chưa thể gửi tự động. Vui lòng gọi 0929.878.666 để được hỗ trợ ngay.";
      submitButton.disabled = false;
      submitButton.textContent = "Gửi lại";
      pushEvent("quote_submit_error", { reason: error?.message || "unknown" });
    }
  });

  if (window.location.hash === "#quote") {
    openWizard();
  }
})();
