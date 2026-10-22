// Project settings P11 rufnak.de – owned by the project, not overwritten by kit-sync.
import { defineSite } from './src/kit/types';

export const site = defineSite({
  id: 'P11',
  name: 'rufnak.de',
  url: 'https://www.rufnak.de',
  description: 'Enrico Rufnak, Softwareentwickler aus Potsdam: Werdegang, Kenntnisse, Zertifikate und Kontakt. Webanwendungen von der Idee bis zum laufenden System.',
  lang: 'de',
  // false = placeholder phase: everything except imprint/privacy is noindex. Set to true at launch.
  live: false,
  nav: [],
  themeColor: '#2b2f33',
  // Imprint/privacy: central operator data from src/kit/operator.ts, email defaults to info@rufnak.de
  // (mailbox must exist at All-Inkl). Umlaut domain: the punycode spelling is added automatically as a second form.
  // Only project-specific overrides here, e.g. MStV responsible person for editorial content:
  // legal: { responsible: { name: 'Enrico Rufnak' } },
  legal: { email: 'enrico@rufnak.de', phone: '+49 177 4233525' },
  // Google Analytics 4 – off by default. To enable: enabled: true and measurement ID (e.g. 'G-ABC123').
  // GA loads only after consent in the banner; the privacy section is added automatically.
  analytics: { enabled: false, ga4Id: '' },
  // Contact form – off by default. enabled: true creates /kontakt/, links it in the footer and extends the privacy policy.
  // to: recipient (default: imprint email); from: sender, must exist at All-Inkl as mailbox/alias (default: noreply@domain)
  // rufnak.de: stays off as long as src/pages/kontakt.astro exists (both generate /kontakt/ → build error).
  contact: { enabled: false },
  // 301 redirects old → new (e.g. old URLs after a relaunch), the target must exist in the build:
  // redirects: { '/ueber.html': '/ueber-mich/' },
  // Old Laravel URLs (until 2026): /kontakt, /impressum and / stay, the rest redirects to the new target in one hop.
  redirects: {
    '/datenschutzerklaerung': '/datenschutz/',
    '/feedback': '/kontakt/',
    '/index.php': '/',
    '/resume': '/',
    '/lebenslauf': '/',
    '/portfolio': '/',
    '/blog': '/',
  },
  // Sections: nested pages (two or more levels) only below these paths, e.g. ['ratgeber'] → /ratgeber/…/
  // Build path segments with slugify() from src/kit/urls.ts (ä→ae, space → hyphen).
  sections: [],
  // Default preview image for pages without their own image (1200×630 px). File: public/og.png, required before launch.
  ogImage: '/og.png',
  // Installable app (pwa-kit) – off by default. First: deploy-tool pwa-sync P11, fill in pwa.config.json and icons.
  pwa: false,
  // additional noindex paths, e.g. ['/suche/']
  noindex: [],
});
