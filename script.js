const header = document.getElementById("siteHeader");
const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");
const contactForm = document.getElementById("contactForm");
const formSuccess = document.getElementById("formSuccess");
const newsletterForm = document.getElementById("newsletterForm");
const newsletterSuccess = document.getElementById("newsletterSuccess");

function updateHeaderState() {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 24);
}

function closeMobileMenu() {
  if (!mobileMenu || !menuToggle) return;
  mobileMenu.classList.remove("is-open");
  menuToggle.classList.remove("is-active");
  menuToggle.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
}

function openMobileMenu() {
  if (!mobileMenu || !menuToggle) return;
  mobileMenu.classList.add("is-open");
  menuToggle.classList.add("is-active");
  menuToggle.setAttribute("aria-expanded", "true");
  document.body.classList.add("menu-open");
}

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.contains("is-open");
    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      closeMobileMenu();
    });
  });

  document.addEventListener("click", (event) => {
    const clickedInsideMenu = mobileMenu.contains(event.target);
    const clickedToggle = menuToggle.contains(event.target);

    if (
      !clickedInsideMenu &&
      !clickedToggle &&
      mobileMenu.classList.contains("is-open")
    ) {
      closeMobileMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && mobileMenu.classList.contains("is-open")) {
      closeMobileMenu();
    }
  });
}

function smoothScrollToTarget(targetId) {
  const target = document.querySelector(targetId);
  if (!target) return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const headerHeight = header ? header.offsetHeight : 0;
  const targetTop =
    target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 16;

  window.scrollTo({
    top: targetTop,
    behavior: prefersReducedMotion ? "auto" : "smooth",
  });
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const href = anchor.getAttribute("href");
    if (!href || href === "#") return;

    const target = document.querySelector(href);
    if (!target) return;

    event.preventDefault();
    smoothScrollToTarget(href);
    closeMobileMenu();
  });
});

window.addEventListener("scroll", updateHeaderState, { passive: true });
updateHeaderState();

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -60px 0px",
    }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const statCounters = document.querySelectorAll("[data-count]");

if ("IntersectionObserver" in window) {
  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        const target = Number(el.dataset.count || "0");
        const duration = 1200;
        const startTime = performance.now();

        const tick = (now) => {
          const progress = Math.min((now - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = String(Math.round(target * eased));

          if (progress < 1) {
            requestAnimationFrame(tick);
          }
        };

        requestAnimationFrame(tick);
        observer.unobserve(el);
      });
    },
    {
      threshold: 0.5,
    }
  );

  statCounters.forEach((counter) => counterObserver.observe(counter));
}

if (contactForm && formSuccess) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    formSuccess.hidden = false;
    contactForm.reset();
  });
}

if (newsletterForm && newsletterSuccess) {
  newsletterForm.addEventListener("submit", (event) => {
    event.preventDefault();
    newsletterSuccess.hidden = false;
    newsletterForm.reset();
  });
}

/* =========================================================
   Accessibility Widget — injected into every page
   ========================================================= */
(function setupAccessibilityWidget() {
  const STORAGE_KEY = "rys_a11y_settings";
  const FEATURES = {
    "large-text": "accessibility-large-text",
    "high-contrast": "accessibility-high-contrast",
    grayscale: "accessibility-grayscale",
    "highlight-links": "accessibility-highlight-links",
  };

  function loadSettings() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch (e) { return {}; }
  }
  function saveSettings(s) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch (e) {}
  }
  function applySettings(s) {
    Object.entries(FEATURES).forEach(([k, cls]) => {
      document.body.classList.toggle(cls, !!s[k]);
    });
  }

  function buildWidget() {
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "a11y-toggle";
    toggle.setAttribute("aria-label", "אפשרויות נגישות");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-controls", "a11yPanel");
    toggle.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="4" r="2"/><path d="M5 8h14"/><path d="M9 8v6l-2 8"/><path d="M15 8v6l2 8"/><path d="M9 14h6"/></svg>';

    const panel = document.createElement("div");
    panel.className = "a11y-panel";
    panel.id = "a11yPanel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", "כלי נגישות");
    panel.innerHTML = `
      <div class="a11y-panel-head">
        <h2 class="a11y-panel-title">כלי נגישות</h2>
        <button type="button" class="a11y-panel-close" aria-label="סגור פאנל נגישות">×</button>
      </div>
      <div class="a11y-controls">
        <button type="button" data-a11y="large-text">הגדלת טקסט</button>
        <button type="button" data-a11y="reduce-text">הקטנת טקסט</button>
        <button type="button" data-a11y="grayscale">גווני אפור</button>
        <button type="button" data-a11y="high-contrast">ניגודיות גבוהה</button>
        <button type="button" data-a11y="highlight-links">הדגשת קישורים</button>
        <button type="button" class="a11y-reset" data-a11y="reset">איפוס הגדרות</button>
      </div>
      <p class="a11y-panel-note">הכלי נועד לשפר את חוויית השימוש באתר. אם נתקלתם בבעיה, ניתן לפנות אלינו.</p>
      <p class="a11y-panel-contact">
        <a href="mailto:office@rys-plast.com">office@rys-plast.com</a> · <a href="tel:049807566">04-9807566</a>
      </p>
    `;

    document.body.appendChild(toggle);
    document.body.appendChild(panel);
    return { toggle, panel };
  }

  function refreshButtonStates(panel, settings) {
    panel.querySelectorAll("[data-a11y]").forEach((btn) => {
      const key = btn.dataset.a11y;
      if (key === "reset" || key === "reduce-text") return;
      btn.classList.toggle("is-active", !!settings[key]);
    });
  }

  function init() {
    const { toggle, panel } = buildWidget();
    let settings = loadSettings();
    applySettings(settings);
    refreshButtonStates(panel, settings);

    function openPanel() { panel.classList.add("is-open"); toggle.setAttribute("aria-expanded", "true"); }
    function closePanel() { panel.classList.remove("is-open"); toggle.setAttribute("aria-expanded", "false"); }

    toggle.addEventListener("click", () => { panel.classList.contains("is-open") ? closePanel() : openPanel(); });
    panel.querySelector(".a11y-panel-close").addEventListener("click", closePanel);

    panel.querySelectorAll("[data-a11y]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const key = btn.dataset.a11y;
        if (key === "reset") {
          settings = {};
          saveSettings(settings); applySettings(settings); refreshButtonStates(panel, settings);
          return;
        }
        if (key === "reduce-text") {
          settings["large-text"] = false;
          saveSettings(settings); applySettings(settings); refreshButtonStates(panel, settings);
          return;
        }
        settings[key] = !settings[key];
        saveSettings(settings); applySettings(settings); refreshButtonStates(panel, settings);
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && panel.classList.contains("is-open")) closePanel();
    });
    document.addEventListener("click", (event) => {
      if (!panel.contains(event.target) && !toggle.contains(event.target) && panel.classList.contains("is-open")) closePanel();
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();

/* =========================================================
   Cookie Consent Banner — injected on first visit
   ========================================================= */
(function setupCookieBanner() {
  const STORAGE_KEY = "rys_cookie_consent";

  function getConsent() { try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; } }
  function setConsent(v) { try { localStorage.setItem(STORAGE_KEY, v); } catch (e) {} }

  function init() {
    if (getConsent()) return;
    const banner = document.createElement("div");
    banner.className = "cookie-banner";
    banner.setAttribute("role", "region");
    banner.setAttribute("aria-label", "הסכמה לשימוש בקובצי Cookie");
    banner.innerHTML = `
      <p class="cookie-banner-text">
        <strong>שימוש ב־Cookies</strong>
        האתר משתמש בקובצי Cookie לצורך תפעול תקין, שיפור חוויית השימוש וניתוח ביצועים. ניתן לאשר את השימוש או להמשיך עם הגדרות חיוניות בלבד.
      </p>
      <div class="cookie-banner-actions">
        <a href="/privacy-policy" class="cookie-link">מדיניות פרטיות</a>
        <button type="button" class="btn btn-secondary" data-cookie="essential">הכרחי בלבד</button>
        <button type="button" class="btn btn-primary" data-cookie="accept">מאשר</button>
      </div>
    `;
    document.body.appendChild(banner);
    requestAnimationFrame(() => banner.classList.add("is-visible"));

    banner.querySelectorAll("[data-cookie]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const choice = btn.dataset.cookie;
        setConsent(choice === "accept" ? "accepted" : "essential");
        banner.classList.remove("is-visible");
        setTimeout(() => banner.remove(), 220);
      });
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
