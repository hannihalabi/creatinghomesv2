/* Enkel trackinghantering för Creating Homes landningssida */
(function () {
  const MEASUREMENT_ID = "G-XXXXXXX"; // ersätt med faktisk GA4-ID

  function loadGA() {
    if (window.gtag) return;

    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;
    gtag("js", new Date());
    gtag("config", MEASUREMENT_ID);

    const script = document.createElement("script");
    script.async = true;
    script.src =
      "https://www.googletagmanager.com/gtag/js?id=" + MEASUREMENT_ID;
    document.head.appendChild(script);
  }

  function trackEvent(action, params) {
    if (typeof window.gtag === "function") {
      window.gtag("event", action, params);
    } else {
      console.info("[Tracking]", action, params);
    }
  }

  function bindCTAEvents() {
    document.querySelectorAll("[data-cta]").forEach((cta) => {
      cta.addEventListener("click", () => {
        const label = cta.getAttribute("data-cta");
        trackEvent("cta_click", {
          event_category: "engagement",
          event_label: label,
        });
      });
    });
  }

  function bindLeadForm() {
    const form = document.querySelector("[data-lead-form]");
    if (!form) return;

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      trackEvent("lead_submit", {
        event_category: "conversion",
        event_label: "lead-form",
      });

      form.reset();
      const existingStatus = form.querySelector("[role='status']");
      if (existingStatus) {
        existingStatus.remove();
      }
      form.insertAdjacentHTML(
        "beforeend",
        '<p role="status">Tack! Vi återkommer inom kort.</p>'
      );
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    loadGA();
    bindCTAEvents();
    bindLeadForm();
  });
})();
