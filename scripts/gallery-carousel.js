(function () {
  function initGallery(gallery) {
    const track = gallery.querySelector(".media-gallery__track");
    const viewport = gallery.querySelector(".media-gallery__viewport");
    const prevBtn = gallery.querySelector("[data-gallery-prev]");
    const nextBtn = gallery.querySelector("[data-gallery-next]");

    if (!track || !viewport || !prevBtn || !nextBtn) {
      return;
    }

    const slides = Array.from(track.querySelectorAll("[data-gallery-slide]"));
    const intervalAttr = parseInt(
      gallery.getAttribute("data-gallery-interval"),
      10
    );
    const autoplayInterval = Number.isFinite(intervalAttr) ? intervalAttr : 6000;
    let autoplayTimer = null;
    let scrollRaf = null;

    const updateButtons = () => {
      const maxScroll = track.scrollWidth - track.clientWidth;
      const tolerance = 4;
      prevBtn.disabled = track.scrollLeft <= tolerance;
      nextBtn.disabled = track.scrollLeft >= maxScroll - tolerance || maxScroll <= 0;
      if (maxScroll <= tolerance) {
        stopAutoplay();
      }
    };

    const centerSlide = (element, behavior = "auto") => {
      if (!element) return;
      const scrollValue =
        element.offsetLeft +
        element.offsetWidth / 2 -
        track.clientWidth / 2;
      track.scrollTo({
        left: Math.max(
          0,
          Math.min(scrollValue, Math.max(0, track.scrollWidth - track.clientWidth))
        ),
        behavior,
      });
    };

    const centerFirstSlide = (behavior = "auto") => {
      centerSlide(slides[0], behavior);
    };

    const scheduleCenterFirstSlide = (behavior = "auto") => {
      requestAnimationFrame(() => centerFirstSlide(behavior));
    };

    const getStep = () => Math.max(viewport.clientWidth * 0.85, 1);

    const scrollByStep = (direction) => {
      track.scrollBy({
        left: direction * getStep(),
        behavior: "smooth",
      });
    };

    const scrollForward = () => {
      const maxScroll = track.scrollWidth - track.clientWidth;
      if (maxScroll <= 0) return;
      const tolerance = 4;
      if (track.scrollLeft >= maxScroll - tolerance) {
        centerFirstSlide("smooth");
      } else {
        scrollByStep(1);
      }
    };

    const canScroll = () => track.scrollWidth - track.clientWidth > 4;

    const findActiveIndex = () => {
      const viewportRect = viewport.getBoundingClientRect();
      let nearestIndex = 0;
      let minDistance = Number.POSITIVE_INFINITY;

      slides.forEach((slide, index) => {
        const rect = slide.getBoundingClientRect();
        const distance = Math.abs(rect.left - viewportRect.left);
        if (distance < minDistance) {
          minDistance = distance;
          nearestIndex = index;
        }
      });

      return nearestIndex;
    };

    const syncVideos = () => {
      const activeIndex = findActiveIndex();
      slides.forEach((slide, index) => {
        const video = slide.querySelector("video");
        if (!video) return;
        if (index === activeIndex) {
          video.play().catch(() => {});
        } else {
          video.pause();
          video.currentTime = 0;
        }
      });
    };

    const stopAutoplay = () => {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    };

    const startAutoplay = (forceRestart = false) => {
      if (forceRestart) {
        stopAutoplay();
      } else if (autoplayTimer) {
        return;
      }
      if (autoplayInterval <= 0 || slides.length <= 1 || !canScroll()) {
        stopAutoplay();
        return;
      }
      autoplayTimer = window.setInterval(scrollForward, autoplayInterval);
    };

    const restartAutoplay = () => {
      startAutoplay(true);
    };

    prevBtn.addEventListener("click", () => {
      scrollByStep(-1);
      restartAutoplay();
    });

    nextBtn.addEventListener("click", () => {
      scrollByStep(1);
      restartAutoplay();
    });

    track.addEventListener("scroll", () => {
      if (scrollRaf) {
        cancelAnimationFrame(scrollRaf);
      }
      scrollRaf = window.requestAnimationFrame(() => {
        updateButtons();
        syncVideos();
      });
    });

    track.addEventListener("pointerdown", stopAutoplay);
    track.addEventListener("pointerup", () => startAutoplay(true));
    track.addEventListener("pointercancel", () => startAutoplay(true));
    track.addEventListener("mouseenter", stopAutoplay);
    track.addEventListener("mouseleave", () => startAutoplay(true));
    track.addEventListener("touchstart", stopAutoplay, { passive: true });
    track.addEventListener("touchend", () => startAutoplay(true));

    const handleResize = () => {
      updateButtons();
      syncVideos();
      scheduleCenterFirstSlide();
      startAutoplay(true);
    };

    if ("ResizeObserver" in window) {
      const resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(track);
      resizeObserver.observe(viewport);
    } else {
      window.addEventListener("resize", handleResize);
    }

    updateButtons();
    syncVideos();
    scheduleCenterFirstSlide();
    startAutoplay(true);
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-gallery]").forEach((gallery) => {
      initGallery(gallery);
    });
  });
})();
