# P11 - rufnak.de

Persönliche Website von Enrico Rufnak, Softwareentwickler (Relaunch 2026).

**Domain:** www.rufnak.de

**Status:** Inhalte und Design fertig, noch `live: false` · Technik: Astro 7 mit astro-kit (siehe `docs/technik.md`)

## Struktur

```
docs/            Konzepte, Notizen, Fahrpläne; og-vorlage.html = Vorlage für public/og.png; guidelines/ = Styleguide, UX, Tonalität, SEO/A11y, Code, Recht
src/             Quellcode (src/kit/ verwaltet das astro-kit, nicht von Hand ändern)
public/          statische Dateien, og.png (1200×630), favicon.svg
assets/          Bilder, Logos, Grafiken
site.config.ts   Projekt-Einstellungen (live, Analytics, Kontakt …)
```

## Entwickeln

```bash
npm ci
npm run dev    # http://localhost:4321/
npm run ci     # Build + Indexierungs-Prüfung (wie der Build-Check im PR)
```

## Platzhalter-Phase

`live: false`: alle Seiten außer Impressum und Datenschutz sind noindex. Inhalte stehen in `src/data/profil.ts`. Für `live: true` (Livegang W9): fertige Texte, Impressum ohne TODO, `og.png` aktuell. Gemeinsame Teile (`src/kit/`, `.kit-manifest`) nur über `deploy-tool kit-sync P11` aktualisieren.

## Hinweise

- Zugangsdaten und Passwörter gehören in eine `.env`-Datei – die wird nicht committet.
