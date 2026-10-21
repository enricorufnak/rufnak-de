// @ts-check
import { defineConfig } from 'astro/config';
import { kit } from './src/kit/integration.ts';

export default defineConfig({
  // kit() sets site, trailingSlash 'always' and build.format 'directory' (URL standard, do not override),
  // checks URLs during the build and provides a sitemap without noindex pages plus 301 redirects.
  integrations: [...kit()],
});
