document.addEventListener("DOMContentLoaded", () => {
  (() => {
    const prefersReducedMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    )?.matches;
    const gsap = window.gsap;

    const html = document.documentElement;
    const toggleBtn = document.querySelector(".theme-toggle");

    const applyTheme = (theme) => {
      const isDark = theme === "dark";
      html.classList.toggle("theme-dark", isDark);
      try {
        localStorage.setItem("theme", isDark ? "dark" : "light");
      } catch {
        // ignore
      }
      if (toggleBtn) toggleBtn.setAttribute("aria-pressed", String(isDark));
    };

    const initTheme = () => {
      let stored = null;
      try {
        stored = localStorage.getItem("theme");
      } catch {
        stored = null;
      }
      if (stored === "light" || stored === "dark") {
        applyTheme(stored);
        return;
      }

      // Default theme: light (only go dark if user saved it)
      applyTheme("light");
    };

    initTheme();

    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        const currentlyDark = html.classList.contains("theme-dark");
        const next = currentlyDark ? "light" : "dark";

        applyTheme(next);
      });
    }
  })();
});
