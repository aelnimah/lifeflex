// ============================================
// LifeFlex Landing Page - Video Autoplay on Scroll (Mobile-safe)
// ============================================

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    const videos = document.querySelectorAll(".demo-video");
    if (!videos.length) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Mobile autoplay requirements: muted + playsInline
    videos.forEach((video) => {
      // Ensure attributes/properties exist even if HTML forgot them
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      video.setAttribute("playsinline", "");
      video.setAttribute("muted", "");
      video.setAttribute("preload", "metadata");

      // If user prefers reduced motion, don't autoplay anything
      if (prefersReducedMotion.matches) {
        video.removeAttribute("autoplay");
      }
    });

    // Helper: safe play (mobile browsers may still block)
    const safePlay = async (video) => {
      try {
        // Some mobile browsers need the video "loaded" before play works reliably
        if (video.readyState < 2) video.load();

        const p = video.play();
        if (p && typeof p.then === "function") await p;
      } catch (e) {
        // Autoplay blocked; keep muted + inline and ignore
        // (User can still tap play)
        // console.log("Autoplay prevented:", e);
      }
    };

    const safePause = (video) => {
      try {
        video.pause();
      } catch (_) {}
    };

    // Prime videos once after first user interaction (helps iOS Safari a lot)
    // This is not required, but improves reliability.
    const primeOnce = () => {
      videos.forEach((v) => {
        // quick play/pause attempt; if blocked, nothing breaks
        safePlay(v).finally(() => safePause(v));
      });
      window.removeEventListener("touchstart", primeOnce);
      window.removeEventListener("click", primeOnce);
      window.removeEventListener("keydown", primeOnce);
    };
    window.addEventListener("touchstart", primeOnce, { passive: true, once: true });
    window.addEventListener("click", primeOnce, { once: true });
    window.addEventListener("keydown", primeOnce, { once: true });

    // IntersectionObserver: play when visible, pause otherwise
    const observer = new IntersectionObserver(
      (entries) => {
        if (prefersReducedMotion.matches) return;

        entries.forEach((entry) => {
          const video = entry.target;

          if (entry.isIntersecting) {
            safePlay(video);
          } else {
            safePause(video);
          }
        });
      },
      {
        threshold: 0.6,         // a bit stricter so it doesn't flicker on mobile
        rootMargin: "0px 0px -10% 0px", // treat bottom as slightly earlier exit
      }
    );

    videos.forEach((video) => observer.observe(video));
  });
})();
