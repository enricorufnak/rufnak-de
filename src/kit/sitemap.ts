// Managed by astro-kit (kit-sync overwrites this file). Changes via PR in astro-kit.
// Sitemap without noindex pages – for astro.config.mjs only (runs during the build, not in the browser).
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { AstroIntegration } from 'astro';
import sitemap, { type SitemapOptions } from '@astrojs/sitemap';
import { NOINDEX_META, normalizePath } from './seo';
import { kitRedirects } from './redirects';

/** URL paths of all built pages with robots noindex */
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
 * Sitemap without noindex pages + 301 redirects from site.config.ts → redirects.
 * Part of kit() (integration.ts) – projects include kit(), not this function.
 * (Do not change the order: the scan must run before the sitemap.)
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
