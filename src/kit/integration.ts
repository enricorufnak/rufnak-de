// Von astro-kit verwaltet (kit-sync überschreibt diese Datei). Änderungen per PR im astro-kit.
// Pflicht-Integration für jedes Projekt: astro.config.mjs → integrations: [...kit()]
// - erzwingt site (aus site.config.ts), trailingSlash 'always' und build.format 'directory' (nicht überschreibbar)
// - prüft nach dem Build den URL-Standard inkl. Rubriken und das Vorschaubild (og.png)
// - mit pwa: true in site.config.ts: ruft pwa-kit (Projektordner pwa-kit/) über dist/ auf
// - Sitemap ohne noindex-Seiten und 301-Weiterleitungen (sitemap.ts, redirects.ts)
// Ohne kit() bricht der Build in BaseLayout ab.
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import type { AstroIntegration } from 'astro';
import type { SitemapOptions } from '@astrojs/sitemap';
import { site } from '../../site.config';
import { kitSitemap } from './sitemap';
import { checkUrls } from './urls';
import { ogImagePath } from './types';

export interface KitOptions {
  /** Zusatzoptionen für @astrojs/sitemap (filter wird mit dem noindex-Filter kombiniert) */
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
          site: site.url,
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
          // Node lädt das Modul selbst (require von ESM, Node ≥ 22.12): Vites Modul-Lader der Config ist hier schon geschlossen
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
