(function () {
  const TRANSITION = "transform 700ms ease";

  function initCarousel(root) {
    const track = root.querySelector(".reco-badges-carousel__track");
    if (!track) return;

    const originalSlides = Array.from(track.children);
    if (originalSlides.length <= 1) return;

    const intervalAttr = parseInt(root.getAttribute("data-carousel-interval"), 10);
    const interval = Number.isFinite(intervalAttr) ? intervalAttr : 6000;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Clone första sliden för mjuk oändlig loop
    const clone = originalSlides[0].cloneNode(true);
    track.appendChild(clone);

    let currentIndex = 0;
    let autoplayId = null;

    const applyTransform = (withTransition = true) => {
      track.style.transition = withTransition ? TRANSITION : "none";
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
    };

    const goNext = () => {
      currentIndex += 1;
      applyTransform(true);
    };

    const stopAutoplay = () => {
      if (autoplayId) {
        clearInterval(autoplayId);
        autoplayId = null;
      }
    };

    const startAutoplay = () => {
      if (prefersReducedMotion.matches || interval <= 0) {
        stopAutoplay();
        return;
      }
      stopAutoplay();
      autoplayId = window.setInterval(goNext, interval);
    };

    track.addEventListener("transitionend", () => {
      const totalSlides = track.children.length;
      if (currentIndex === totalSlides - 1) {
        track.style.transition = "none";
        currentIndex = 0;
        track.style.transform = "translateX(0)";
        requestAnimationFrame(() => {
          // force reflow innan vi återställer transition
          void track.offsetHeight;
          track.style.transition = TRANSITION;
        });
      }
    });

    root.addEventListener("mouseenter", stopAutoplay);
    root.addEventListener("mouseleave", startAutoplay);

    if (typeof prefersReducedMotion.addEventListener === "function") {
      prefersReducedMotion.addEventListener("change", startAutoplay);
    }

    applyTransform(false);
    startAutoplay();
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-reco-carousel]").forEach(initCarousel);
  });
})();
