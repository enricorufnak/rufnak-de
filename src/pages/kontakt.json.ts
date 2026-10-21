// Von astro-kit verwaltet (kit-sync überschreibt diese Datei). Änderungen per PR im astro-kit.
// Konfiguration für public/kontakt.php. Per .htaccess für Besucher gesperrt.
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
