# SEO- und Barrierefreiheits-Regeln

Stand: 21.10.2026 · Ziel: Namenssuche „Enrico Rufnak“ auf Platz 1, WCAG 2.2 Stufe AA
Vieles erledigt das astro-kit automatisch (markiert mit **Kit**). Diese Punkte nicht von Hand nachbauen.

## A. SEO

### A1. Pro Seite (Pflicht)

| Regel | Umsetzung |
|---|---|
| `title` eindeutig, „Thema – Enrico Rufnak“, ≤ 60 Zeichen inkl. „\| rufnak.de“ | `<Layout title="…">`; Kit hängt Site-Namen an |
| `description` eindeutig, 120–160 Zeichen, enthält Name + Seitenthema | `<Layout description="…">`, sonst `site.description` |
| genau **eine** `<h1>` | Startseite: Name in der Leiste; Unterseiten: Seitentitel (Name dort als Link) |
| Überschriften ohne Sprung (h1 → h2 → h3) | – |
| Canonical, `robots`, Open Graph, Twitter-Card | **Kit** (`BaseLayout.astro`) |
| `lang="de"` | **Kit** über `site.lang` |
| Vorschaubild 1200 × 630 | `public/og.png`, eigenes Bild per `image`-Prop |

### A2. URLs

- Kleinbuchstaben, ASCII (ä→ae, ö→oe, ü→ue, ß→ss), Bindestrich, **mit `/` am Ende** (`/kontakt/`). **Kit** prüft im Build.
- Keine IDs/Nummern in URLs, keine Hash-URLs für eigenständige Inhalte.
- Eine veröffentlichte URL wird nie geändert. Muss sie doch weg: 301 über `site.config.ts → redirects` (ein Sprung, Ziel muss existieren).
- Projekte (später): `/projekte/<slug>/`, Dateiname = Slug, Entwürfe nur über `getPublishedProjects()` (Details: Projektordner `website/relaunch-analyse-urls-seo.md` 2.1–2.2).

### A3. Indexierung

- `live: false` → alles außer Impressum/Datenschutz `noindex`. Beim Livegang `live: true`. **Kit**
- noindex-Seiten fehlen automatisch in der Sitemap; `npm run ci` prüft das. **Kit**
- Zusätzliche noindex-Pfade nur über `site.config.ts → noindex`, nie per Meta-Tag im Markup.
- robots.txt sperrt nichts (Suchmaschinen müssen `noindex` lesen können). **Kit**
- Staging: Basic Auth + `X-Robots-Tag` per Server-Header. **Kit/deploy-tool**

### A4. Strukturierte Daten

- Startseite: JSON-LD `Person` (Name, Rolle, Bild, Ort, `sameAs` = Profile aus `profil.ts`). Bei neuem Profil-Link automatisch drin.
- Nur Daten auszeichnen, die sichtbar auf der Seite stehen.
- Nach Änderung: Rich-Results-Test.

### A5. Inhalt

- Name „Enrico Rufnak“ in h1/Titel der Startseite, Rolle + Ort im ersten Absatz bzw. Leiste.
- Interne Links mit sprechendem Text („Mein Weg“, nicht „hier“).
- Profile (GitHub, LinkedIn, Xing) verlinken zurück auf `https://www.rufnak.de/` (nach Livegang einmal prüfen).

## B. Barrierefreiheit (WCAG 2.2 AA)

### B1. Wahrnehmbar

| Regel | Stand / Umsetzung |
|---|---|
| Kontrast Text ≥ 4,5:1, große Schrift/Grafik ≥ 3:1 | Tabelle in [01-brand-styleguide.md](01-brand-styleguide.md#3-farben-palette-graphit--senf). `--mustard` nie als Text auf Hell, `--muted` nie auf `--soft` |
| Alt-Texte | Foto: „Enrico Rufnak“; Deko-Grafik `alt=""` bzw. `aria-hidden="true"` |
| Info nicht nur über Farbe | z. B. aktuelle Seite: Hintergrund **und** fett |
| Text bis 200 % zoombar, Umbruch bei 320 px ohne Querscrollen | `clamp()`-Größen, keine festen Höhen für Text |
| Bilder mit `width`/`height` | verhindert Layout-Sprünge |

### B2. Bedienbar

| Regel | Umsetzung |
|---|---|
| Alles per Tastatur erreichbar, logische Reihenfolge | Leiste → Inhalt; keine `tabindex` > 0 |
| Sprunglink „Zum Inhalt springen“ → `#inhalt` | **Kit**; `<main id="inhalt">` im Layout Pflicht |
| Fokus sichtbar, nicht verdeckt (2.4.11) | Senf-Ring; sticky Leiste verdeckt nichts (liegt seitlich) |
| Zielgröße ≥ 24 × 24 px (2.5.8) | `.copy` liegt knapp an der Grenze → bei Änderungen prüfen |
| Keine Bewegung ohne Nutzerwunsch | `prefers-reduced-motion` schaltet Übergänge und weiches Scrollen ab |
| Keine Zeitlimits | Toast ist nur Rückmeldung, Inhalt bleibt sichtbar |

### B3. Verständlich

- `lang="de"`; fremdsprachige Abschnitte (falls je) mit `lang="en"`.
- Navigation auf allen Seiten gleich (3.2.3), gleiche Bezeichnungen (3.2.4).
- Links nennen ihr Ziel; `mailto:`/`tel:` zeigen die Adresse/Nummer als Linktext.

### B4. Robust

- Semantisches HTML zuerst: `nav` mit `aria-label`, `ol` für Zeitleisten, `dl` für Kontaktdaten, `figure`/`blockquote` für Zitate, `section` mit `aria-labelledby`.
- ARIA nur, wo HTML nicht reicht (`aria-current="page"`, `role="status"` am Toast).
- Gültiges HTML, eindeutige `id`s.

### B5. Rechtlicher Rahmen

Das Barrierefreiheitsstärkungsgesetz (BFSG, seit 28.06.2025) gilt für bestimmte Produkte und Dienstleistungen von Unternehmen an Verbraucher. Eine private Lebenslauf-Seite ohne Angebot fällt nach üblicher Lesart nicht darunter; WCAG 2.2 AA ist hier freiwilliger Qualitätsstandard. Siehe [06-rechtliche-compliance.md](06-rechtliche-compliance.md).

## C. Vor jedem PR

- [ ] `npm run ci` grün (Build, URL-Standard, Sitemap/noindex)
- [ ] Neue Seite: Titel, Beschreibung, eine h1, in Sitemap (sofern indexierbar)
- [ ] Lighthouse (lokal, `live: true` testweise): alle vier Werte ≥ 95
- [ ] Tastatur-Durchgang + Screenreader-Stichprobe (VoiceOver/NVDA) auf geänderten Seiten
- [ ] Kontrast neuer Farbkombinationen geprüft
- [ ] Geänderte URL? → 301 eingetragen

## D. Nach dem Livegang

- [ ] Search Console (Domain-Property): Sitemap einreichen, `/` indexieren lassen
- [ ] Nach 2–4 Wochen: Abdeckung, 404, Position Namenssuche
- [ ] Rich-Results-Test und OG-Vorschau (LinkedIn Post Inspector)
