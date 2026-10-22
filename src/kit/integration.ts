// Managed by astro-kit (kit-sync overwrites this file). Changes via PR in astro-kit.
// Required integration for every project: astro.config.mjs → integrations: [...kit()]
// - enforces site (from site.config.ts, main domain without trailing /), trailingSlash 'always' and build.format 'directory' (cannot be overridden)
// - after the build, checks the URL standard incl. sections and the preview image (og.png)
// - with pwa: true in site.config.ts: runs pwa-kit (project folder pwa-kit/) over dist/
// - sitemap without noindex pages and 301 redirects (sitemap.ts, redirects.ts)
// Without kit() the build fails in BaseLayout.
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import type { AstroIntegration } from 'astro';
import type { SitemapOptions } from '@astrojs/sitemap';
import { site } from '../../site.config';
import { kitSitemap } from './sitemap';
import { checkUrls } from './urls';
import { ogImagePath, siteUrl } from './types';

export interface KitOptions {
  /** Extra options for @astrojs/sitemap (filter is combined with the noindex filter) */
  sitemap?: SitemapOptions;
}

export function kit(options: KitOptions = {}): AstroIntegration[] {
  let root = process.cwd();
  let buildPwa: ((o: { outDir: string; root: string }) => { version: string }) | undefined;
  const core: AstroIntegration = {
    name: 'kit-core',
    hooks: {
      'astro:config:setup': ({ updateConfig }) => {
        updateConfig({
          site: siteUrl(site),
          trailingSlash: 'always',
          build: { format: 'directory' },
          vite: { define: { 'import.meta.env.KIT_CORE': JSON.stringify('1') } },
        });
      },
      'astro:config:done': ({ config }) => {
        root = fileURLToPath(config.root);
        if (site.pwa) {
          const kitFile = join(root, 'pwa-kit', 'build.mjs');
          if (!existsSync(kitFile)) {
            throw new Error(`site.config.ts: pwa ist true, aber pwa-kit/ fehlt im Projekt. → deploy-tool pwa-sync ${site.id}`);
          }
          // Node loads the module itself (require of ESM, Node ≥ 22.12): Vite's config module loader is already closed here
          ({ buildPwa } = createRequire(import.meta.url)(kitFile));
        }
        if (config.trailingSlash !== 'always' || config.build.format !== 'directory') {
          throw new Error(
            "astro.config.mjs: trailingSlash muss 'always' und build.format 'directory' sein (URL-Standard, von kit() gesetzt – nicht überschreiben)."
          );
        }
      },
      'astro:build:done': ({ dir, logger }) => {
        const distDir = fileURLToPath(dir);
        if (buildPwa) {
          const { version } = buildPwa({ outDir: distDir, root });
          logger.info(`PWA: Manifest, Icons, Offline-Seite und sw.js geschrieben (Version ${version})`);
        }
        checkUrls(distDir, site);
        const og = ogImagePath(site);
        if (!existsSync(join(distDir, og.slice(1)))) {
          const msg = `Vorschaubild ${og} fehlt (public${og}, 1200×630 px; Pfad über site.config.ts → ogImage).`;
          if (site.live) throw new Error(msg);
          logger.warn(msg + ' Vor dem Livegang anlegen.');
        }
      },
    },
  };
  return [core, ...kitSitemap(options.sitemap)];
}
