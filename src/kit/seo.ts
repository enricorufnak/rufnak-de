// Von astro-kit verwaltet (kit-sync überschreibt diese Datei). Änderungen per PR im astro-kit.
// Indexierungs-Standard P01–P12:
// - Impressum und Datenschutz sind immer indexierbar und in der Sitemap
// - noindex für Platzhalter (live: false), Danke-/Bestätigungsseiten, interne Suche, Vorschauen, 404
//   sowie jede Seite, der das Layout noindex übergibt (z. B. aus dem Frontmatter)
// - Einzige Quelle ist <meta name="robots"> in der gebauten Seite: kitSitemap() (sitemap.ts) lässt alle noindex-Seiten
//   automatisch aus der Sitemap, check-indexing.mjs prüft das im Build.
import type { SiteConfig } from './types';

export const ALWAYS_INDEX = ['/impressum/', '/datenschutz/'];
export const ALWAYS_NOINDEX = ['/404/', '/danke/'];
export const NOINDEX_META = /<meta\s+name=["']robots["']\s+content=["'][^"']*noindex/i;

export function normalizePath(path: string): string {
  let p = path.split(/[?#]/)[0] || '/';
  if (p.endsWith('/index.html')) p = p.slice(0, -'index.html'.length);
  else if (p.endsWith('.html')) p = p.slice(0, -'.html'.length) + '/';
  if (!p.startsWith('/')) p = '/' + p;
  if (!p.endsWith('/')) p += '/';
  return p;
}

/** Regel aus site.config.ts (ohne Seiten-Prop): Rechtsseiten immer, sonst nur wenn live */
export function isNoindex(path: string, site: SiteConfig): boolean {
  const p = normalizePath(path);
  if (ALWAYS_INDEX.includes(p)) return false;
  if (ALWAYS_NOINDEX.includes(p)) return true;
  if ((site.noindex ?? []).map(normalizePath).includes(p)) return true;
  return !site.live;
}
