// Managed by astro-kit (kit-sync overwrites this file). Changes via PR in astro-kit.
// URL standard: https://www.<domain>/, lowercase letters, digits, hyphen, trailing /.
// slugify() builds path segments; checkUrls() fails the build if a built page deviates.
// deploy-tool checks the same rule again before deploying, based on the sitemap.
import { readdirSync } from 'node:fs';
import type { SiteConfig } from './types';

/** Path following the URL standard: /, /a/, /a-b/c/ */
export const STANDARD_PATH = /^\/([a-z0-9]+(-[a-z0-9]+)*\/)*$/;
const SEGMENT = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/** Text → URL segment: lowercase, ä→ae, ö→oe, ü→ue, ß→ss, strip accents, everything else → hyphen. */
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

/** Segments → path following the URL standard, e.g. pagePath('ratgeber', 'Wörter zählen') → /ratgeber/woerter-zaehlen/ */
export function pagePath(...segments: string[]): string {
  const parts = segments.map(slugify).filter(Boolean);
  return parts.length ? `/${parts.join('/')}/` : '/';
}

/** Validate the sections from site.config.ts and return them normalized */
export function sectionList(site: SiteConfig): string[] {
  const sections = site.sections ?? [];
  const bad = sections.filter((s) => !SEGMENT.test(s));
  if (bad.length) {
    throw new Error(`site.config.ts: sections ${bad.map((s) => `'${s}'`).join(', ')} sind keine gültigen URL-Segmente (z. B. 'ratgeber').`);
  }
  return sections;
}

/** Error for a built path, otherwise undefined */
export function urlError(path: string, sections: string[]): string | undefined {
  if (!STANDARD_PATH.test(path)) return `${path}: nur a–z, 0–9 und Bindestrich, / am Ende (Segmente mit slugify() bilden)`;
  const parts = path.split('/').filter(Boolean);
  if (sections.length && parts.length >= 2 && !sections.includes(parts[0])) {
    return `${path}: Unterseiten nur in den Rubriken ${sections.map((s) => `/${s}/`).join(', ')} (site.config.ts → sections)`;
  }
  return undefined;
}

/** Check all built HTML pages; throws with all errors (build fails).
 *  Excluded: 404.html and offline.html (pwa-kit, fixed URL). */
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
