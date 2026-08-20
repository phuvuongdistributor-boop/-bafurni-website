(() => {
  const storageKey = "ba_utm_attribution_v1";
  const fields = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];

  function emptyAttribution() {
    return fields.reduce((result, field) => {
      result[field] = "";
      return result;
    }, {});
  }

  function readStoredAttribution() {
    try {
      const stored = JSON.parse(sessionStorage.getItem(storageKey) || "null");
      if (!stored || typeof stored !== "object") return emptyAttribution();
      return fields.reduce((result, field) => {
        result[field] = typeof stored[field] === "string" ? stored[field] : "";
        return result;
      }, {});
    } catch (_error) {
      try {
        sessionStorage.removeItem(storageKey);
      } catch (_storageError) {
        // Storage can be unavailable in strict privacy contexts; URL attribution still works.
      }
      return emptyAttribution();
    }
  }

  function capture() {
    const params = new URLSearchParams(window.location.search);
    const hasCampaignParams = fields.some((field) => params.has(field));
    if (!hasCampaignParams) return readStoredAttribution();

    const current = fields.reduce((result, field) => {
      result[field] = String(params.get(field) || "").trim().slice(0, 500);
      return result;
    }, {});
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(current));
    } catch (_error) {
      // Keep the current URL attribution even when first-party storage is unavailable.
    }
    return current;
  }

  function sync(form = document.querySelector("#quote-form")) {
    if (!form) return capture();
    const attribution = capture();
    fields.forEach((field) => {
      const input = form.elements.namedItem(field);
      if (!input) return;
      input.value = attribution[field];
      input.defaultValue = attribution[field];
    });
    return attribution;
  }

  capture();
  window.BA_LEAD_ATTRIBUTION = Object.freeze({
    storage: "sessionStorage",
    fields: Object.freeze([...fields]),
    get: () => Object.freeze({ ...capture() }),
    sync
  });
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => sync(), { once: true });
  } else {
    sync();
  }
})();
