// Von astro-kit verwaltet (kit-sync überschreibt diese Datei). Änderungen per PR im astro-kit.
// Kein Disallow: Suchmaschinen müssen noindex-Seiten lesen können, um sie auszuschließen.
import type { APIRoute } from 'astro';
import { site } from '../../site.config';

export const GET: APIRoute = () =>
  new Response(`User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap-index.xml\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
