(function () {
  "use strict";

  const allowedEvents = new Set(["qr_open", "product_page_view", "product_recognized"]);

  window.trackEvent = function (name, details) {
    if (!allowedEvents.has(name)) return;

    const product = details && typeof details.product === "string" ? details.product : null;
    window.dispatchEvent(new CustomEvent("hilssort:analytics", {
      detail: Object.freeze({ name, product })
    }));
  };
})();
