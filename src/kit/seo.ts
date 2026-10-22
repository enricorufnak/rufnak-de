// Managed by astro-kit (kit-sync overwrites this file). Changes via PR in astro-kit.
// Indexing standard P01–P12:
// - imprint and privacy policy are always indexable and in the sitemap
// - noindex for placeholders (live: false), thank-you/confirmation pages, internal search, previews, 404
//   and every page the layout passes noindex to (e.g. from frontmatter)
// - The only source is <meta name="robots"> in the built page: kitSitemap() (sitemap.ts) leaves out all noindex pages
//   automatically, check-indexing.mjs verifies this in the build.
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

/** Rule from site.config.ts (without page prop): legal pages always, otherwise only when live */
export function isNoindex(path: string, site: SiteConfig): boolean {
  const p = normalizePath(path);
  if (ALWAYS_INDEX.includes(p)) return false;
  if (ALWAYS_NOINDEX.includes(p)) return true;
  if ((site.noindex ?? []).map(normalizePath).includes(p)) return true;
  return !site.live;
}
