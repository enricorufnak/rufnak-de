# Code- und Performance-Standards

Stand: 21.10.2026 · ergänzt `docs/technik.md` (Stack-Entscheidung)

## 1. Stack (fest)

| Punkt | Festlegung |
|---|---|
| Framework | Astro 7, rein statisch, Node ≥ 22.12 (`package.json` → `engines`; `.nvmrc` = 22 für CI/nvm) |
| Basis | astro-kit (`src/kit/`, `.kit-manifest`, Kit-Seiten) – **nur per `deploy-tool kit-sync P11`** ändern |
| Inhalte | `src/data/profil.ts`; später Projekte als Markdown-Collection (kein MDX, keine remark/rehype-Plugins) |
| Styles | eine Datei `src/styles/theme.css` mit Tokens in `:root` |
| JavaScript | Vanilla JS oder Alpine.js; **kein React/Vue/Svelte** (Ziel: später unverändert in Blade nutzbar) |
| Schriften | `@fontsource`, nur `latin` + `latin-ext`, nur genutzte Schnitte |
| Hosting | ALL-INKL (Apache), `.htaccess` vom Kit, Deploy per `deploy-tool deploy P11` |

## 2. Dateien und Zuständigkeit

| Datei/Ordner | Wem gehört's | Ändern |
|---|---|---|
| `src/kit/**`, `public/.htaccess`, `src/pages/{impressum,datenschutz,404,danke,robots.txt}…` | astro-kit | PR im astro-kit, dann kit-sync |
| `site.config.ts` | Projekt | direkt (live, redirects, legal, noindex) |
| `src/layouts/Layout.astro`, `src/components/`, `src/styles/theme.css`, `src/data/` | Projekt | direkt |
| `docs/` | Projekt | direkt; Guidelines bei Design-Änderung im selben PR |

## 3. Code-Regeln

**Allgemein**
- **Code-Kommentare auf Englisch.** Inhaltliche Bezeichner (z. B. `werdegang`, `kenntnisse` in `profil.ts`) dürfen deutsch bleiben; Texte für Besucher sind deutsch. Kit-Dateien ändern ihre Kommentare nur über das astro-kit.
- Jede Datei beginnt mit einem Kommentar: Zweck + wem sie gehört.
- Keine Inhalte im Markup hart codieren, die in `profil.ts` gehören (Kontaktdaten, Werdegang, Kenntnisse).
- Keine Geheimnisse im Repo; `.env` wird nicht committet.

**HTML/Astro**
- Semantik vor `div` (siehe 04, B4).
- `compressHTML: 'jsx'`: Leerraum zwischen Inline-Elementen explizit mit `{' '}` oder per Flex/Gap.
- Props typisieren (`interface Props`), Standardwerte im Destructuring.
- `<main id="inhalt">` und Props-Durchreichung an `BaseLayout` nicht entfernen.

**CSS**
- Nur Tokens (`var(--…)`), keine neuen Hex-Werte außerhalb `:root`.
- Kurze, sprechende Klassen wie bestehend (`.tl`, `.skill`, `.contact`); kein Utility-Framework (kein Tailwind).
- Mobile Anpassungen in den bestehenden `@media`-Blöcken am Dateiende (900 / 720 / 480 px).
- Keine `!important` außer in `prefers-reduced-motion`.

**JavaScript**
- Nur Progressive Enhancement: Seite funktioniert vollständig ohne JS.
- Kein clientseitiges Rendering von Inhalten, keine Bundles aus npm für Kleinigkeiten.
- Event-Delegation statt vieler Listener (wie Kopieren-Buttons).

**Abhängigkeiten**
- Versionen exakt pinnen (wie `package.json`), `package-lock.json` immer committen.
- Neue Abhängigkeit nur mit Begründung im PR; Major-Updates als eigener PR mit Build-Check.
- Keine Laufzeit-Abhängigkeit, die Requests an Dritte auslöst (CDN, Fonts, Analytics, Embeds).

## 4. Performance-Budgets

Messung 21.10.2026 (`npm run build`, Startseite):

| Messgröße | Ist | Budget |
|---|---|---|
| HTML Startseite | 12,9 KB (4,4 KB gzip) | ≤ 30 KB roh |
| CSS gesamt | 17,2 KB (1 Datei) | ≤ 30 KB roh |
| JavaScript | inline, < 1 KB | ≤ 10 KB, kein Framework-Runtime |
| Schriften (woff2, latin) | ~158 KB, davon Caveat 51 KB (latin-ext lädt nur bei Bedarf) | ≤ 200 KB, keine neuen Schnitte |
| Bilder je Seite | Foto als WebP + JPG-Fallback | Foto ≤ 40 KB (WebP), `og.png` ≤ 150 KB |
| Requests an Dritte | 0 | **0** |
| Lighthouse (alle 4) | 99–100 (20.10.2026) | ≥ 95 |
| LCP / CLS / INP (mobil) | – | ≤ 2,0 s / ≤ 0,05 / ≤ 200 ms |

**Hebel, falls Budget reißt:** Caveat auf genutzte Zeichen subsetten (größter Brocken), Bilder in AVIF/WebP mit festen Maßen, `font-display: swap` beibehalten, keine zusätzlichen Fonts.

## 5. Caching und Header (Kit)

- `/_astro/*` (Hash im Namen): 1 Jahr `immutable`; HTML: kein Cache; Bilder 7 Tage; woff2 1 Jahr.
- Security-Header: HSTS, CSP (`default-src 'self'`), `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options`. Eine neue externe Quelle bricht die CSP → gewollt.
- gzip über `mod_deflate`.

## 6. Workflow

1. Branch von `main` (`feat/…`, `fix/…`, `docs/…`, `chore/…`).
2. Commits im Stil Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`), **Message auf Englisch**, Autor Enrico Rufnak, keine KI-/Tool-Hinweise.
3. Lokal: `npm run dev`, vor dem Push `npm run ci`.
4. PR mit Vorlage (`.github/pull_request_template.md`), Titel und Beschreibung auf Englisch, keine KI-/Tool-Hinweise; Build-Check muss grün sein. Ein Thema je PR (z. B. ein Projekt je PR).
5. Nach dem Merge: `deploy-tool deploy P11 --dry-run`, dann `deploy-tool deploy P11`. Größere Änderungen vorher über `--staging`.

## 7. Vor jedem PR (Code)

- [ ] `npm run ci` grün
- [ ] Keine Änderung unter `src/kit/` oder an Kit-Seiten
- [ ] Keine neuen externen Requests (DevTools → Network: nur eigene Domain)
- [ ] Budgets eingehalten (`du -sh dist`, Größe `dist/_astro/*.css`)
- [ ] Funktioniert ohne JS
- [ ] Bei Projekten: grep in `dist/` findet keinen Entwurfs-Titel
