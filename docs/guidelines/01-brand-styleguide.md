# Brand Styleguide

Stand: 21.10.2026 · Quelle der Werte: `src/styles/theme.css`

## 1. Kern

| Punkt | Festlegung |
|---|---|
| Absender | Enrico Rufnak, Person (keine Firma, keine Marke) |
| Rolle | „Softwareentwickler aus Potsdam“ (genau so, überall gleich) |
| Leitsatz | „Ich entwickle Software, die *verständlich* bleibt.“ |
| Werte | Zielorientiert · Analytisch · Flexibel |
| Zielgruppe | Recruiter, Arbeitgeber, Fachkolleginnen und -kollegen, Kontakte aus dem Netzwerk |
| Ziel der Seite | Werdegang und Kenntnisse zeigen, Kontakt leicht machen, Namenssuche „Enrico Rufnak“ bedienen |
| Charakter | ruhig, persönlich, aufgeräumt, handwerklich solide |

**Abgrenzung (verbindlich)**
- Kein Freelance- oder Dienstleistungsangebot, keine Preise, kein „Jetzt anfragen“. Der Arbeitgeber soll keinen Anstoß nehmen.
- Arbeitgeber nur im Werdegang nennen, nicht im Hero, nicht bei Kenntnissen.
- KI-Mitwirkung an Design oder Texten nicht erwähnen; kein „selbst gestaltet“ behaupten. KI erscheint nur als Kenntnis („KI-gestütztes Arbeiten“).

## 2. Name und Wortmarke

- Es gibt **kein Logo**. Die Wortmarke ist der Name in Lora 600: **Enrico Rufnak**.
- Schreibweise Domain: `rufnak.de` (klein, ohne `www` im Fließtext), Website-Name im Titel: `rufnak.de`.
- Favicon: `public/favicon.svg` (+ `favicon.ico`, `apple-touch-icon.png`). Nicht ohne Grund ändern; Änderungen auch in `og.png` prüfen.

## 3. Farben (Palette „Graphit & Senf“)

| Token | Hex | Rolle | Erlaubt für Text? |
|---|---|---|---|
| `--side` | `#2b2f33` | Seitenleiste, dunkle Flächen, Primär-Button | Ja (als Hintergrund für Weiß) |
| `--side2` | `#22262a` | dunkler Ton (Foto-Hintergrund) | – |
| `--page` | `#f5f5f3` | Seitenhintergrund | – |
| `--card` | `#ffffff` | Karten | – |
| `--ink` | `#1d2023` | Haupttext | Ja |
| `--muted` | `#686d72` | Nebentext | Ja, nur auf `--page`/`--card` |
| `--soft` | `#e7e7e2` | Linien, Tags | Nur `--ink` darauf |
| `--mustard` | `#d9a521` | Akzent: Punkte, Häkchen, Unterstreichungen, Fokusring | **Nein auf Hell** (2,06:1); ja als Fläche mit `--ink` darauf |
| `--mustard-ink` | `#8a6508` | Senf als Text auf Hell (Eyebrows, Hervorhebung, Links in Rechtstexten) | Ja |
| `--hand` | `#f2c94c` | Handschrift auf Dunkel | Ja, nur auf `--side` |

**Geprüfte Kontraste (WCAG)**

| Vordergrund / Hintergrund | Verhältnis | Ergebnis |
|---|---|---|
| ink / page | 14,99:1 | AAA |
| muted / page | 4,79:1 | AA |
| muted / card | 5,23:1 | AA |
| mustard-ink / page | 4,88:1 | AA |
| weiß / side | 13,49:1 | AAA |
| hand / side | 8,50:1 | AAA |
| ink / mustard | 7,29:1 | AAA |
| mustard / page | 2,06:1 | **nur Deko** |
| muted / soft | 4,21:1 | **nicht verwenden** |

**Regeln**
- Senf ist Akzent, nie Fläche über ganze Bereiche. Pro Bildschirmhöhe wenige Senf-Stellen.
- Ein Farbschema (hell mit dunkler Leiste), **kein Dark Mode**. `color-scheme: light` bleibt.
- Keine neuen Farben ohne Eintrag hier und in `theme.css`. Transparenzen nur als Weiß auf Dunkel (`rgba(255,255,255,.08–.14)`).

## 4. Schriften

Alle lokal über `@fontsource` (keine Verbindung zu Google), nur `latin` + `latin-ext`.

| Schrift | Rolle | Schnitte | Einsatz |
|---|---|---|---|
| **Lora** (Serif) | Überschriften, Name, Zitate | 500, 600, 500 italic | h1–h3, Kartentitel, Zitattext |
| **Karla** (Sans) | Fließtext, Navigation, Buttons, Daten | 400, 500, 700 | alles Übrige |
| **Caveat** (Handschrift) | persönliche Randnotiz | 600 | max. 4 Wörter, z. B. „Hallo, ich bin“, „Sag gern Hallo!“, „Mein aktueller Schwerpunkt“ |

**Regeln**
- Caveat nie für Inhalte, die man lesen *muss* (Navigation, Daten, Buttons). Rein schmückend → `aria-hidden="true"` wie im Seitenkopf.
- Höchstens eine Caveat-Zeile je Abschnitt.
- Keine weiteren Schriftschnitte nachladen (jeder Schnitt kostet ~13–23 KB).
- Größen siehe [02-ui-ux.md](02-ui-ux.md#3-typografie).

## 5. Bildsprache

- **Profilfoto:** realistisches Porträt, rund beschnitten, neutraler Hintergrund, Blick zur Kamera. Mit KI erstellt (Shorty, 21.10.2026); Rechtliches siehe [06](06-rechtliche-compliance.md#4-urheber--und-persönlichkeitsrecht). Bei neuem Foto: Seite, `og.png`, JSON-LD gemeinsam tauschen.
- Dateien: `public/img/enrico-rufnak.webp` + `.jpg`, quadratisch, mind. 320 × 320 px (2× für 160 px).
- Keine Stockfotos, keine Illustrationen mit Personen, keine Emojis als Gestaltung.
- Icons sparsam und typografisch (✓ in Zertifikaten, „ als Zitatzeichen). Keine Icon-Bibliothek einbinden.
- Vorschaubild `public/og.png` (1200 × 630) aus `docs/og-vorlage.html`; bei Änderung an Foto, Rolle oder Farben neu erzeugen.

## 6. Formen

- Runde Ecken: 999 px (Pillen: Buttons, Chips, Navigation), 24 px (Kontaktblock), 18–20 px (Karten), 14 px (Zeitleiste, Zertifikate).
- Keine Schatten auf Karten; Tiefe nur über Flächenfarbe (page → card → side).
- Linien 1–2 px in `--soft`.

## 7. Do / Don't

| Do | Don't |
|---|---|
| Name + Rolle immer zusammen | Titel wie „Senior“, „Full-Stack-Ninja“ |
| Senf für einen Akzent je Element | Senf als Textfarbe auf Hell (`--mustard`) |
| Caveat für eine kurze persönliche Zeile | Caveat für ganze Sätze oder Buttons |
| Echte Daten aus `src/data/profil.ts` | Zahlen/Jahre im Hero („seit 15 Jahren …“) |
