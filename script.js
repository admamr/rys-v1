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
