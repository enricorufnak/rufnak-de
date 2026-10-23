// Managed by astro-kit (kit-sync overwrites this file). Changes via PR in astro-kit.
// No Disallow: search engines must be able to read noindex pages in order to exclude them.
import type { APIRoute } from 'astro';
import { site } from '../../site.config';

export const GET: APIRoute = () =>
  new Response(`User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap-index.xml\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
