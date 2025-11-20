(function () {
  function initHeroVideo() {
    const primaryIntro = document.querySelector("[data-hero-intro-primary]");
    const mainVideo = document.querySelector("[data-hero-main]");

    if (!primaryIntro || !mainVideo) {
      return;
    }

    const desktopQuery = window.matchMedia("(min-width: 900px)");

    const setMode = () => {
      if (desktopQuery.matches) {
        primaryIntro.classList.remove("is-visible");
        mainVideo.classList.add("is-visible");
        mainVideo.loop = true;
        primaryIntro.pause();
        mainVideo.preload = "metadata";
        mainVideo.play().catch(() => {});
      } else {
        mainVideo.classList.remove("is-visible");
        primaryIntro.classList.add("is-visible");
        mainVideo.pause();
        primaryIntro.loop = true;
        primaryIntro.preload = "metadata";
        primaryIntro.play().catch(() => {});
      }
    };

    setMode();

    if (typeof desktopQuery.addEventListener === "function") {
      desktopQuery.addEventListener("change", setMode);
    } else if (typeof desktopQuery.addListener === "function") {
      desktopQuery.addListener(setMode);
    }
  }

  document.addEventListener("DOMContentLoaded", initHeroVideo);
})();
