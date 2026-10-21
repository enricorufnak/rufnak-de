# Guidelines rufnak.de

Stand: 21.10.2026 · Grundlage: `main` (Seite im Prototyp-Design ohne Projekte, `live: false`)

| Dokument | Wofür |
|---|---|
| [01-brand-styleguide.md](01-brand-styleguide.md) | Positionierung, Name, Farben, Schriften, Bildsprache |
| [02-ui-ux.md](02-ui-ux.md) | Layout, Abstände, Komponenten, Zustände, Navigation |
| [03-tone-of-voice.md](03-tone-of-voice.md) | Ansprache, Stil, Wortliste, Microcopy |
| [04-seo-barrierefreiheit.md](04-seo-barrierefreiheit.md) | Regeln für Meta-Daten, URLs, Struktur, WCAG 2.2 AA |
| [05-code-performance.md](05-code-performance.md) | Stack, Code-Regeln, Budgets, Workflow |
| [06-rechtliche-compliance.md](06-rechtliche-compliance.md) | Checkliste Impressum, Datenschutz, Urheberrecht (kein Rechtsrat) |

## Rangfolge

1. Recht (06) vor allem anderen.
2. Barrierefreiheit (04) vor Design (01, 02): Wenn ein Gestaltungswunsch einen Kontrast oder die Bedienbarkeit verschlechtert, gilt 04.
3. Die Werte in `src/styles/theme.css` sind die Quelle. Weicht ein Dokument davon ab, ist das Dokument zu korrigieren.

## Pflege

- Änderungen an Design-Tokens: zuerst `theme.css`, dann 01/02 nachziehen, im selben PR.
- Dateien unter `src/kit/` und die vom Kit verwalteten Seiten (Impressum, Datenschutz, 404, danke) nicht von Hand ändern; Änderungen per PR im astro-kit, dann `deploy-tool kit-sync P11`.
- Jeder PR prüft gegen die Checklisten in 04 und 05 (Abschnitt „Vor jedem PR“).
