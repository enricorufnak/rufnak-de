// Von astro-kit verwaltet (kit-sync überschreibt diese Datei). Änderungen per PR im astro-kit.
// URL-Standard: https://www.<domain>/, Kleinbuchstaben, Ziffern, Bindestrich, / am Ende.
// slugify() erzeugt Pfad-Segmente; checkUrls() bricht den Build ab, wenn eine gebaute Seite abweicht.
// Das deploy-tool prüft dieselbe Regel vor dem Deploy noch einmal anhand der Sitemap.
import { readdirSync } from 'node:fs';
import type { SiteConfig } from './types';

/** Pfad nach URL-Standard: /, /a/, /a-b/c/ */
export const STANDARD_PATH = /^\/([a-z0-9]+(-[a-z0-9]+)*\/)*$/;
const SEGMENT = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/** Text → URL-Segment: Kleinschreibung, ä→ae, ö→oe, ü→ue, ß→ss, Akzente weg, alles andere → Bindestrich. */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Segmente → Pfad nach URL-Standard, z. B. pagePath('ratgeber', 'Wörter zählen') → /ratgeber/woerter-zaehlen/ */
export function pagePath(...segments: string[]): string {
  const parts = segments.map(slugify).filter(Boolean);
  return parts.length ? `/${parts.join('/')}/` : '/';
}

/** Rubriken aus site.config.ts prüfen und normalisiert liefern */
export function sectionList(site: SiteConfig): string[] {
  const sections = site.sections ?? [];
  const bad = sections.filter((s) => !SEGMENT.test(s));
  if (bad.length) {
    throw new Error(`site.config.ts: sections ${bad.map((s) => `'${s}'`).join(', ')} sind keine gültigen URL-Segmente (z. B. 'ratgeber').`);
  }
  return sections;
}

/** Fehler zu einem gebauten Pfad, sonst undefined */
export function urlError(path: string, sections: string[]): string | undefined {
  if (!STANDARD_PATH.test(path)) return `${path}: nur a–z, 0–9 und Bindestrich, / am Ende (Segmente mit slugify() bilden)`;
  const parts = path.split('/').filter(Boolean);
  if (sections.length && parts.length >= 2 && !sections.includes(parts[0])) {
    return `${path}: Unterseiten nur in den Rubriken ${sections.map((s) => `/${s}/`).join(', ')} (site.config.ts → sections)`;
  }
  return undefined;
}

/** Alle gebauten HTML-Seiten prüfen; wirft mit allen Fehlern (Build bricht ab).
 *  Ausgenommen: 404.html und offline.html (pwa-kit, feste URL). */
export function checkUrls(distDir: string, site: SiteConfig): void {
  const sections = sectionList(site);
  const errors: string[] = [];
  for (const entry of readdirSync(distDir, { recursive: true })) {
    const rel = String(entry).replace(/\\/g, '/');
    if (!rel.endsWith('.html') || rel === '404.html' || rel === 'offline.html') continue;
    if (rel !== 'index.html' && !rel.endsWith('/index.html')) {
      errors.push(`/${rel}: Seiten nur als Verzeichnis-URL (…/index.html)`);
      continue;
    }
    const path = '/' + rel.slice(0, -'index.html'.length);
    const err = urlError(path, sections);
    if (err) errors.push(err);
  }
  if (errors.length) throw new Error(`URL-Standard verletzt:\n  - ${errors.join('\n  - ')}`);
}
