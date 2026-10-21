// @ts-check
import { defineConfig } from 'astro/config';
import { kit } from './src/kit/integration.ts';

export default defineConfig({
  // kit() setzt site, trailingSlash 'always' und build.format 'directory' (URL-Standard, nicht überschreiben),
  // prüft die URLs im Build und liefert Sitemap ohne noindex-Seiten sowie 301-Weiterleitungen.
  integrations: [...kit()],
});
