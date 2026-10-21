// Von astro-kit verwaltet (kit-sync überschreibt diese Datei). Änderungen per PR im astro-kit.
// Sitemap ohne noindex-Seiten – nur für astro.config.mjs (läuft im Build, nicht im Browser).
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { AstroIntegration } from 'astro';
import sitemap, { type SitemapOptions } from '@astrojs/sitemap';
import { NOINDEX_META, normalizePath } from './seo';
import { kitRedirects } from './redirects';

/** URL-Pfade aller gebauten Seiten mit robots noindex */
export function noindexPaths(distDir: string): Set<string> {
  const paths = new Set<string>();
  for (const entry of readdirSync(distDir, { recursive: true })) {
    const rel = String(entry).replace(/\\/g, '/');
    if (!rel.endsWith('.html')) continue;
    if (NOINDEX_META.test(readFileSync(join(distDir, rel), 'utf8'))) paths.add(normalizePath('/' + rel));
  }
  return paths;
}

/**
 * Sitemap ohne noindex-Seiten + 301-Weiterleitungen aus site.config.ts → redirects.
 * Teil von kit() (integration.ts) – Projekte binden kit() ein, nicht diese Funktion.
 * (Reihenfolge nicht ändern: der Scan muss vor der Sitemap laufen.)
 */
export function kitSitemap(options: SitemapOptions = {}): AstroIntegration[] {
  let noindex = new Set<string>();
  const scan: AstroIntegration = {
    name: 'kit-noindex-scan',
    hooks: {
      'astro:build:done': ({ dir }) => {
        noindex = noindexPaths(fileURLToPath(dir));
      },
    },
  };
  return [
    scan,
    sitemap({
      ...options,
      filter: (page) => !noindex.has(normalizePath(new URL(page).pathname)) && (options.filter?.(page) ?? true),
    }),
    kitRedirects(),
  ];
}
