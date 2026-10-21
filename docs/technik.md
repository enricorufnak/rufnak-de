# Technik-Entscheidungen

Stand: 06.10.2026

## Entscheidung

- **Geltungsbereich:** Persönliche Website (Relaunch)
- **Stack:** Astro 7 (statisch), Node ≥ 22.12 – Muster P01, ein Stack für alle Projekte
- **Neuaufsetzen:** direkt mit `astro@^7` beginnen, nicht mit Astro 5/6; `package-lock.json` von Anfang an committen
- **Major-Updates:** immer als eigener PR mit Build-Check
- **Später:** Laravel im selben Repo, schrittweise Übernahme (wie P01)

## Hinweise für Astro 7

| Thema | Festlegung |
|---|---|
| Zod | `import { z } from 'astro/zod'` (nicht aus `astro:content`), Zod-4-Syntax (z. B. `z.url()`) |
| Inhalte | reines Markdown (`.md`), kein MDX; Markdown-Verarbeitung ohne remark/rehype-Plugins |
| URLs | `trailingSlash: 'always'`, `build.format: 'directory'` (siehe URL-Standard) |
| Whitespace | `compressHTML: 'jsx'` ist Standard → Abstand zwischen Inline-Elementen explizit mit `{" "}` oder per Flex/Gap |
| Interaktive Teile | Vanilla JS oder Alpine.js, kein React/Vue (läuft später unverändert in Blade) |
