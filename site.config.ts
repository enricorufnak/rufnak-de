// Projekt-Einstellungen P11 rufnak.de – gehört dem Projekt, wird von kit-sync nicht überschrieben.
import { defineSite } from './src/kit/types';

export const site = defineSite({
  id: 'P11',
  name: 'rufnak.de',
  url: 'https://www.rufnak.de',
  description: 'Enrico Rufnak, Softwareentwickler aus Potsdam: Werdegang, Kenntnisse, Zertifikate und Kontakt. Webanwendungen von der Idee bis zum laufenden System.',
  lang: 'de',
  // false = Platzhalter-Phase: alles außer Impressum/Datenschutz ist noindex. Beim Livegang auf true setzen.
  live: false,
  nav: [],
  themeColor: '#2b2f33',
  // Impressum/Datenschutz: zentrale Betreiberdaten aus src/kit/operator.ts, E-Mail automatisch info@rufnak.de
  // (Postfach muss bei All-Inkl existieren). Umlaut-Domain: Punycode-Schreibweise erscheint automatisch als Zweitform.
  // Hier nur Abweichungen für dieses Projekt, z. B. MStV-Verantwortlicher bei Ratgeber-Inhalten:
  // legal: { responsible: { name: 'Enrico Rufnak' } },
  legal: { email: 'enrico@rufnak.de', phone: '+49 177 4233525' },
  // Google Analytics 4 – Standard aus. Zum Aktivieren: enabled: true und Mess-ID (z. B. 'G-ABC123').
  // Geladen wird GA erst nach Zustimmung im Banner; der Datenschutz-Abschnitt erscheint automatisch.
  analytics: { enabled: false, ga4Id: '' },
  // Kontaktformular – Standard aus. enabled: true legt /kontakt/ an, verlinkt sie im Footer und ergänzt den Datenschutz.
  // to: Empfänger (Standard: E-Mail aus dem Impressum); from: Absender, muss bei All-Inkl als Postfach/Alias existieren (Standard: noreply@Domain)
  // rufnak.de: bleibt aus, solange es src/pages/kontakt.astro gibt (beide erzeugen /kontakt/ → Build-Fehler).
  contact: { enabled: false },
  // 301-Weiterleitungen alt → neu (z. B. alte URLs nach einem Relaunch), Ziel muss es im Build geben:
  // redirects: { '/ueber.html': '/ueber-mich/' },
  // Alte Laravel-URLs (bis 2026): /kontakt, /impressum und / bleiben, der Rest geht in einem Sprung aufs neue Ziel.
  redirects: {
    '/datenschutzerklaerung': '/datenschutz/',
    '/feedback': '/kontakt/',
    '/index.php': '/',
    '/resume': '/',
    '/lebenslauf': '/',
    '/portfolio': '/',
    '/blog': '/',
  },
  // Rubriken: Unterseiten (zwei oder mehr Ebenen) nur unter diesen Pfaden, z. B. ['ratgeber'] → /ratgeber/…/
  // Pfad-Segmente mit slugify() aus src/kit/urls.ts bilden (ä→ae, Leerzeichen → Bindestrich).
  sections: [],
  // Standard-Vorschaubild für Seiten ohne eigenes Bild (1200×630 px). Datei: public/og.png, Pflicht vor dem Livegang.
  ogImage: '/og.png',
  // Installierbare App (pwa-kit) – Standard aus. Vorher: deploy-tool pwa-sync P11, pwa.config.json und Icons füllen.
  pwa: false,
  // zusätzliche noindex-Pfade, z. B. ['/suche/']
  noindex: [],
});
