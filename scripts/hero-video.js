(function () {
  function initHeroVideo() {
    const primaryIntro = document.querySelector("[data-hero-intro-primary]");
    const mainVideo = document.querySelector("[data-hero-main]");

    if (!primaryIntro || !mainVideo) {
      return;
    }

    const desktopQuery = window.matchMedia("(min-width: 900px)");

    if (desktopQuery.matches) {
      primaryIntro.classList.remove("is-visible");
      mainVideo.classList.add("is-visible");
      mainVideo.loop = true;
      mainVideo.play().catch(() => {});
      return;
    }

    primaryIntro.classList.add("is-visible");
    primaryIntro.loop = true;
    primaryIntro.play().catch(() => {});
  }

  document.addEventListener("DOMContentLoaded", initHeroVideo);
})();
