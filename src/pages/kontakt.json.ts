// Managed by astro-kit (kit-sync overwrites this file). Changes via PR in astro-kit.
// Configuration for public/kontakt.php. Blocked for visitors via .htaccess.
import type { APIRoute } from 'astro';
import { site } from '../../site.config';
import { asciiEmail, contactEnabled, legalInfo, siteDomain } from '../kit/types';

export const GET: APIRoute = () =>
  new Response(
    JSON.stringify({
      enabled: contactEnabled(site),
      to: asciiEmail(site.contact?.to ?? legalInfo(site).email),
      from: asciiEmail(site.contact?.from ?? `noreply@${siteDomain(site).ascii}`),
      site: site.name,
      domain: siteDomain(site).ascii,
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );
