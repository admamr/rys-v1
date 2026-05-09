# RYS Plast — Production Readiness Audit (CRO / SEO / GEO / AEO / A11y)

Date: 2026-05-09
Scope: pre-launch readiness pass. No visual redesign performed.

---

## 1. Files scanned

Root files:
- `index.html`, `about.html`, `services-products.html`, `unidome.html`, `machines.html`, `contact.html`
- `styles.css`, `unidome-styles.css`, `script.js`
- `.gitignore`
- `assets/` directory (logos, factory imagery, machine images, Unidome assets, team photos)

No prior `.htaccess`, `404.html`, `sitemap.xml`, `privacy-policy.html`, or `terms-of-use.html` existed.

---

## 2. Files created

- `privacy-policy.html` — Hebrew RTL legal copy with cautious wording, 9 sections + reviewer note.
- `terms-of-use.html` — Hebrew RTL legal copy with cautious wording, 9 sections + reviewer note.
- `404.html` — branded error page (eyebrow `404`, main message, primary + secondary CTAs, helpful internal links).
- `sitemap.xml` — 8 URLs covering all public clean URLs.
- `.htaccess` — clean URL rewrites + custom 404.
- `cro-seo-aeo-audit.md` — this audit.

---

## 3. Files changed

- `styles.css` — appended four scoped sections at the end:
  - `/* Legal Pages */` (`.legal-page` scope)
  - `/* Error 404 Page */` (`.error-page` scope)
  - `/* Accessibility Widget */` (`.a11y-toggle`, `.a11y-panel`, `body.accessibility-*`)
  - `/* Cookie Consent Banner */` (`.cookie-banner`)
- `script.js` — appended two IIFEs at the end:
  - `setupAccessibilityWidget()` — injects floating button + panel, persists state, applies body classes.
  - `setupCookieBanner()` — injects banner if no consent, persists choice.
- `index.html`, `machines.html`, `unidome.html` — fixed broken footer legal URLs (`/privacy` → `/privacy-policy`, `/terms` → `/terms-of-use`). No layout, structure, or design changes.

No global selectors were overwritten. No external libraries were added.

---

## 4. CRO improvements

- Custom branded 404 page recovers lost visitors with two strong CTAs (back to home + contact) and three supporting internal links to commercial pages.
- Cookie banner is non-blocking and dismissible with two clear options (accept / essential only) — no dark patterns.
- Footer legal links repaired so trust signals do not 404.
- Accessibility widget improves usability without introducing modals that interrupt the conversion flow.

---

## 5. SEO improvements

- Sitemap covers all public commercial pages with priorities reflecting commercial intent (home 1.0, services-products 0.9, contact 0.9, unidome 0.85, machines 0.8, about 0.7, legal 0.3).
- `.htaccess` enforces clean canonical URLs (single trailing-slash-free form), preventing duplicate content between `/page` and `/page.html`.
- `404.html` carries `noindex,follow` so soft 404s are not indexed but link equity flows.
- Privacy and Terms pages include canonical, OG metadata, robots, and theme-color tags consistent with the rest of the site.
- 301 redirect from `index.html` to `/` consolidates root signal.

---

## 6. GEO (geographic / local) improvements

- Existing `Organization` schema on `about.html` already includes `PostalAddress` (Julis industrial area), `telephone`, `email`, `areaServed: IL`. Confirmed accurate; no changes made.
- `contact.html` already exposes `ContactPage` schema referencing the same Organization node. Verified.
- Footer surfaces address, tel, email on every page (kept as-is).
- Recommendation (deferred): add `LocalBusiness` schema with `geo` lat/lng + `openingHoursSpecification` if the client confirms business hours and coordinates.

---

## 7. AEO (answer engine) improvements

- Sectioned, scannable Hebrew Q&A-style headers on the new legal pages improve answer extraction (`איזה מידע נאסף`, `שמירת מידע`, `Cookies וכלי מדידה`).
- Structured `<article>` blocks with `<h2>` per section give LLM/answer-engines clean question-answer chunks.
- Recommendation (deferred): add a visible FAQ block to `services-products.html` (e.g., min order quantity, supported tonnage range, lead time guidance) with `FAQPage` schema, since FAQ schema must mirror visible content.

---

## 8. Accessibility changes

- Floating button (`.a11y-toggle`) injected on every page via `script.js`, with `aria-label="אפשרויות נגישות"`, `aria-expanded`, `aria-controls`.
- Panel (`role="dialog"`, `aria-label="כלי נגישות"`) provides:
  - הגדלת טקסט / הקטנת טקסט
  - גווני אפור
  - ניגודיות גבוהה
  - הדגשת קישורים
  - איפוס הגדרות
- Choices persist in `localStorage` under `rys_a11y_settings` and are reapplied on every page load.
- Body classes used: `accessibility-large-text`, `accessibility-high-contrast`, `accessibility-grayscale`, `accessibility-highlight-links`.
- Esc key closes the panel; outside-click closes the panel.
- Panel includes the cautious wording: *"הכלי נועד לשפר את חוויית השימוש באתר. אם נתקלתם בבעיה, ניתן לפנות אלינו."* — no compliance claims.
- 404 helpful links and CTAs use semantic `<a>` and existing `.btn` system for keyboard accessibility.
- New legal pages use proper heading hierarchy (`h1` → `h2`).

This is a usability tool. **No formal accessibility-standard certification is claimed.**

---

## 9. Cookie banner behavior

- Appears only if `localStorage.getItem("rys_cookie_consent")` is empty.
- Two buttons: **מאשר** → stores `accepted`; **הכרחי בלבד** → stores `essential`.
- Privacy Policy link in banner points to `/privacy-policy`.
- Banner is non-blocking, fixed at the bottom, mobile-stacked, dismisses with a fade and removes itself from the DOM.
- No tracking scripts are injected — consent state is captured for future integrations only.

---

## 10. Sitemap URLs included

```
https://rys-plast.com/                 priority 1.0
https://rys-plast.com/services-products priority 0.9
https://rys-plast.com/contact           priority 0.9
https://rys-plast.com/unidome           priority 0.85
https://rys-plast.com/machines          priority 0.8
https://rys-plast.com/about             priority 0.7
https://rys-plast.com/privacy-policy    priority 0.3
https://rys-plast.com/terms-of-use      priority 0.3
```

Note: the spec listed `/products` but the live site uses `/services-products` (existing nav, internal links, and file `services-products.html`). The sitemap matches site reality. If the client wants `/products` as a public URL, add a rewrite alias and republish.

`404.html` is intentionally excluded from the sitemap.

---

## 11. .htaccess rules added

```
Options -MultiViews
RewriteEngine On
DirectoryIndex index.html
ErrorDocument 404 /404.html

# 301: index.html → /
# 301: /page.html → /page  (clean URLs)
# Internal: /page → /page.html
# Direct allow: sitemap.xml, robots.txt
```

HTTPS / www-redirect not enforced (per spec — pending SSL/domain confirmation).

---

## 12. Alt text improvements summary

- New `404.html`, legal pages, and injected widgets use proper `aria-label` and `aria-hidden` on decorative SVGs.
- Existing pages' alt text already follows the established pattern (`assets/factory-floor.jpg` → "רצפת ייצור במפעל RYS Plast", etc.) — no surgical changes applied because the task forbids redesigning pages and existing alt text is descriptive.
- Recommendation: a future pass should review `unidome.html` Unidome product images, where some `alt=""` may exist on hero/decorative images (verify with a screen reader).

---

## 13. Recommended A/B tests

1. **Homepage hero CTA wording** — `קבלת הצעת מחיר` vs. `דברו איתנו עכשיו` vs. `שיחת ייעוץ ללא עלות`.
2. **Contact page form headline** — current `שלחו לנו פרטים על הפרויקט` vs. `קבלו הצעת מחיר תוך 24 שעות`.
3. **Machines page CTA** — `למערך המכונות` vs. `בדקו התאמה למכונה` (intent-driven).
4. **Services-products section order** — capabilities-first vs. products-first.
5. **Unidome CTA wording** — feature-led vs. outcome-led ("בדקו התאמה לפרויקט").
6. **Mobile sticky phone CTA** visibility — always-on bottom-bar phone tap vs. current static CTA.
7. **Final CTA placement** — single bottom CTA strip vs. mid-page + bottom strip duplication.

---

## 14. Remaining recommendations

- **Legal review.** Privacy and terms text is generic, cautious, and explicitly flagged for legal review (HTML comment at top of each file, plus visible reviewer note in body). Do **not** publish as-is for regulated use without counsel.
- **HTTPS + canonical host** — once SSL is live, add `RewriteCond %{HTTPS} off` block and choose www / non-www canonical.
- **`robots.txt`** — add a minimal `User-agent: * / Allow: / / Sitemap: https://rys-plast.com/sitemap.xml`.
- **OG image** — referenced as `/assets/og-image.jpg` across pages but file may be missing — add a 1200×630 branded image.
- **Image loading attributes** — apply `loading="lazy"` and `decoding="async"` to below-the-fold imagery in next surgical pass.
- **`LocalBusiness` schema** with `geo` and `openingHoursSpecification` (pending client confirmation of hours).
- **`FAQPage` schema** added alongside a visible FAQ block on services-products and machines.
- **Server-side form handler** — `contact.html` form is frontend-only with a TODO comment. Wire to the chosen backend / form service.
- **Consider adding canonical hreflang** if an English version is planned.
- **Audit `unidome.html` and `services-products.html`** for any remaining hardcoded `.html` internal links that should use clean URLs.

---

## 15. Deployment notes

- Apache (mod_rewrite) required for `.htaccess` clean URLs.
- Confirm `.htaccess` overrides are allowed (`AllowOverride All`) on the host.
- Deploy together: new HTML files, updated `styles.css`, updated `script.js`, `.htaccess`, `sitemap.xml`.
- After deploy:
  1. Hit `/contact`, `/about`, `/services-products`, `/unidome`, `/machines`, `/privacy-policy`, `/terms-of-use` — confirm 200.
  2. Hit `/contact.html` — confirm 301 to `/contact`.
  3. Hit `/this-does-not-exist` — confirm 404 page renders with full layout.
  4. Open any page → confirm accessibility button appears bottom-start, panel opens, settings persist across reload.
  5. Open any page in private window → confirm cookie banner appears, click `מאשר` → reload → confirm it does not reappear.
  6. Submit `sitemap.xml` to Google Search Console + Bing Webmaster Tools.
  7. Validate Privacy/Terms canonical tags resolve to the canonical clean URL.

---

## Confirmations

- ✅ No separate CSS files were created. All new styling sits inside `styles.css`.
- ✅ No external libraries added.
- ✅ No visual redesign performed.
- ✅ Global header/nav/footer design preserved (only fixed three broken legal-link `href` values).
- ✅ Clean URLs supported for `/`, `/about`, `/services-products`, `/unidome`, `/machines`, `/contact`, `/privacy-policy`, `/terms-of-use`.
- ✅ Cookie banner and accessibility widget are functional and persist state in `localStorage`.
- ✅ `cro-seo-aeo-audit.md` created.
