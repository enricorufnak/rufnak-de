# UI/UX Guidelines

Stand: 21.10.2026 · Umsetzung: `src/layouts/Layout.astro`, `src/styles/theme.css`, `src/components/`

## 1. Grundsätze

1. **Eine Aufgabe je Besuch:** Nach 10 Sekunden weiß man, wer Enrico ist, was er kann und wie man ihn erreicht.
2. **Kontakt immer erreichbar:** auf Desktop in der Seitenleiste, mobil über „Kontakt“ in der Navigation und am Ende der Startseite.
3. **Funktioniert ohne JavaScript.** JS nur als Verbesserung (z. B. Kopieren-Buttons).
4. **Ruhe vor Effekt:** keine Animationen außer Hover-Farbwechsel (0,15 s) und weichem Scrollen; beides aus bei `prefers-reduced-motion`.

## 2. Layout

| Bereich | Desktop (> 900 px) | Tablet/Handy (≤ 900 px) |
|---|---|---|
| Raster | 2 Spalten: Seitenleiste 310 px + Inhalt | 1 Spalte |
| Seitenleiste | fest (sticky), volle Höhe: Foto, Name, Rolle, Navigation, Kontakt, Profile, Kenntnisse | oben, Foto 96 px neben Name; nur Navigation; Kontakt/Kenntnisse ausgeblendet |
| Inhalt | max. 900 px breit, Abschnitte mit 64 px Abstand | Seitenrand mind. 16 px |
| Kontaktblock | 2 Spalten | 1 Spalte; ≤ 480 px Label über Wert |

Weitere Umbrüche: 720 px (Schwerpunkt-Grafik vertikal), 480 px (Kontakt). Neue Breakpoints nur, wenn eine Komponente bei diesen nicht funktioniert.

Pflicht: keine horizontale Scrollleiste ab 320 px Breite; getestet mindestens bei 320, 390, 768, 1280 px.

## 3. Typografie

| Element | Schrift | Größe | Klasse |
|---|---|---|---|
| Hero-Überschrift | Lora 500 | `clamp(2rem, 4.4vw, 3.1rem)`, Zeilenhöhe 1.12 | `.big` |
| Abschnitt (h2) | Lora 600 | 1.6rem | `.s` |
| Unterabschnitt (h3) | Lora 600 | 1.15rem | `.sub` |
| Kartentitel | Lora 600 | 1.1–1.12rem | `.skill h3`, `.traits b` |
| Fließtext | Karla 400 | 16 px, Zeilenhöhe 1.55 | – |
| Lead | Karla 400 | 1.08rem, Zeilenhöhe 1.7, max. 60ch | `.lead` |
| Nebentext | Karla | .85–.94rem, `--muted` | `.note`, `.skillnote` |
| Eyebrow/Handschrift | Caveat 600 | 1.5–1.7rem | `.eyebrow`, `.hand`, `.hi` |
| Kleine Labels | Karla 700, Versalien, Sperrung .12–.16em | .7rem | `.side-h`, `.flow .step small` |

- Zeilenlänge Fließtext max. 60–66ch.
- Zahlen in Zeitleiste/Zertifikaten mit `font-variant-numeric: tabular-nums`.
- Keine Schrift unter .7rem; Fließtext nie unter 16 px.

## 4. Abstände und Formen

- Abstandsstufen (px): 2, 4, 6, 10, 12, 14, 18, 20, 22, 26, 28, 32, 64. Keine neuen Zwischenwerte.
- Kartenabstand im Raster: 14 px; Innenabstand Karte: 20–22 px.
- Radien siehe [01-brand-styleguide.md](01-brand-styleguide.md#6-formen).

## 5. Komponenten

| Komponente | Klasse | Regeln |
|---|---|---|
| Primär-Button | `.btn` | dunkel (`--side`), Hover schwarz; je Bereich höchstens einer |
| Sekundär-Button | `.btn.o` | Kontur 2 px `--ink`, Hover gefüllt |
| Navigation | `aside nav a` | Pillen; aktuelle Seite `aria-current="page"` + fett; Anker auf Startseite, sonst `/#anker` |
| Eigenschaften | `.traits` | genau 3 Karten, Titel 1 Wort, Text 1 Satz |
| Zeitleiste | `.tl` (`ol`) | neuester Eintrag oben, erster Punkt Senf; Ausbildung `.tl.edu` mit grauen Punkten |
| Zertifikate | `.certs` | Raster ab 190 px, ✓-Kreis in Senf |
| Kenntnisse | `.skillgrid` / `.skill` | Raster ab 250 px; Schwerpunkt als dunkle `.feature`-Karte über volle Breite |
| Tags/Chips | `.tags span`, `.chips` | auf Hell: `--soft` + `--ink`; auf Dunkel: Weiß 12 % |
| Zitate | `.quotes figure` | Zitat wörtlich, Quelle in `figcaption` |
| Kontaktblock | `.contact` (`Kontakt.astro`) | dunkel, Handschrift-Zeile, `dl` mit E-Mail, Mobil, Adresse; Links `mailto:`/`tel:` |
| Kopieren-Button | `.copy` | ohne JS `hidden`; mit JS sichtbar; Rückmeldung per Toast |
| Toast | `.toast` | `role="status"`, 1,8 s, unten mittig, 2–3 Wörter („Kopiert“) |
| Projekt-Filter | `.filters` | Pillen je Kategorie mit Anzahl, `aria-pressed`; ohne JS `hidden` (dann alle Projekte sichtbar); nur bei ≥ 2 Kategorien |
| Projekt-Karte | `.proj` / `.card` | Raster ab 240 px; Nummer (`.num`), Kategorie, Titel (h2), ein Satz, „Steckbrief ansehen →“ in `--mustard-ink`; Hover nur Schatten |
| Steckbrief | `.detail`, `.dhead`, `.dgrid`, `.block`, `.facts` | Kopf mit Senf-Nummer, h1, Lead; Textblöcke links, Faktenbox rechts (280 px, sticky); ≤ 900 px untereinander; ohne Textblöcke Faktenbox über volle Breite; leere Felder nicht rendern |
| Vor/Zurück | `.pn` | zwei Karten; die zweite rechtsbündig; ≤ 480 px untereinander, beide linksbündig; nur bei ≥ 2 Projekten |
| Fußzeile | `.site-footer` | © Jahr, „online seit 2016, neu gestaltet 2026“, ggf. „Über diese Seite“ (→ `/projekte/rufnak-de/`), Rechtliches-Links |
| Rechtsseiten | `.kit-page` | vom Kit, Stil kommt aus `theme.css` |

**Neue Komponente:** nur, wenn keine bestehende passt. Dann: Klasse in `theme.css` im passenden Abschnitt, Zustände (Hover, Fokus, ohne JS, mobil) definieren, hier eintragen.

## 6. Zustände und Interaktion

- **Hover:** Farbwechsel, keine Größen- oder Positionsänderung.
- **Fokus:** `:focus-visible` mit 2 px Senf-Ring, 3 px Abstand. Nie `outline: none` ohne Ersatz.
- **Klickflächen:** mind. 24 × 24 px (WCAG 2.5.8), Ziel 44 × 44 px für Navigation und Buttons auf Mobil.
- **Links:** im Fließtext unterstrichen (Senf-Unterstrich, 3 px Abstand); in der Leiste ohne Unterstrich, Hover mit Unterstrich.
- **Externe Links** (Profile) im selben Tab, `rel="me"`; kein `target="_blank"` ohne Hinweis.
- **Weiches Scrollen** zu Ankern; Abschnitte mit `scroll-margin-top: 24px`.

## 7. Inhalte und Navigation

- Hauptnavigation: Über mich · Mein Weg · Kenntnisse · (Projekte) · Kontakt. Maximal 5 Einträge.
- Eigenständige Inhalte bekommen eine eigene URL (`/kontakt/`), keine Hash-Seiten.
- **Projekte:** `/projekte/` und `/projekte/<slug>/` aus `src/content/projekte/`. Nav-Eintrag „Projekte“, Startseiten-Button „Projekte ansehen“ und Übersicht erst, wenn mindestens ein Projekt veröffentlicht ist (`draft: false`); Footer-Link „Über diese Seite“ erst mit P11. Entwürfe nur in `npm run dev` sichtbar (Hinweis „Entwurf“).
- 404: kurze Erklärung + Link zur Startseite (Kit-Seite).
- Leere Bereiche nie zeigen: Abschnitt ohne Inhalt wird nicht gerendert.

## 8. Vor jedem PR (UI)

- [ ] 320 / 390 / 768 / 1280 px angesehen, keine horizontale Scrollleiste
- [ ] Tastatur: Tab-Reihenfolge logisch, Fokus überall sichtbar, Sprunglink funktioniert
- [ ] Ohne JavaScript nutzbar
- [ ] Nur Tokens aus `theme.css`, keine neuen Hex-Werte im Markup
