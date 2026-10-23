// Managed by astro-kit (kit-sync overwrites this file). Changes via PR in astro-kit.

export interface NavItem {
  label: string;
  href: string;
}

import { domainToASCII, domainToUnicode } from 'node:url';
import { operator } from './operator';

export interface LegalInfo {
  /** Operator name (natural person or company) */
  owner: string;
  street: string;
  zip: string;
  city: string;
  country?: string;
  /** Imprint email. Default: info@<project domain> (from site.url, without www) */
  email?: string;
  /** Second spelling of the email, e.g. punycode for umlaut domains.
   *  Default: automatically info@xn--… if the domain contains umlauts; otherwise none. */
  emailAlt?: string;
  phone?: string;
  /** VAT ID, if available */
  vatId?: string;
  /** Legal form, if it should be shown (e.g. Einzelunternehmen, UG) */
  legalForm?: string;
  /** Authorized representative (for companies/associations) */
  representative?: string;
  /** Register entry (commercial/association register) */
  register?: { court: string; number: string };
  /** Responsible person under § 18(2) MStV (journalistic-editorial content, e.g. guides); address as operator if not given */
  responsible?: { name: string; address?: string };
  /** Consumer dispute resolution notice (§ 36 VSBG): 'unwilling' = not willing/obliged, 'none' = no notice */
  consumerDispute?: 'unwilling' | 'none';
  /** Competent data protection authority (operator's location), shown in the privacy policy under the right to lodge a complaint */
  supervisoryAuthority?: { name: string; address: string };
  /** Server logs as configured in KAS (Settings → Logs & statistics), shown in the privacy policy.
   *  ip: 'full' = complete, 'shortened' = 11.22.0.0, 'anonymized' = 0.0.0.0, 'none' = no logs;
   *  retentionDays: retention period; statistics: access statistics from the logs */
  serverLogs?: { ip: 'full' | 'shortened' | 'anonymized' | 'none'; retentionDays: number; statistics?: boolean };
}

export interface SiteConfig {
  /** Project ID, e.g. P01 */
  id: string;
  name: string;
  /** Live URL without trailing slash, e.g. https://www.ehrenamtskiste.de */
  url: string;
  description: string;
  lang?: string;
  /** false = placeholder phase: all pages except imprint/privacy are noindex */
  live: boolean;
  nav: NavItem[];
  /** Overrides of the central operator data (src/kit/operator.ts); only list changed fields */
  legal?: Partial<LegalInfo>;
  /** Google Analytics 4 (default: off). Active only with enabled: true and a valid ga4Id;
   *  GA loads only after consent in the banner. */
  analytics?: { enabled: boolean; ga4Id?: string };
  /** Contact form (default: off). enabled: true creates /kontakt/ (form → kontakt.php).
   *  to: recipient (default: legal.email, as ASCII/punycode)
   *  from: sender – must be an existing mailbox/alias of the domain at All-Inkl (default: noreply@domain) */
  contact?: { enabled: boolean; to?: string; from?: string };
  /** 301 redirects old → new, e.g. { '/ueber.html': '/ueber-mich/' }.
   *  Old: any old path; new: path following the URL standard that exists in the build. Never change existing URLs silently. */
  redirects?: Record<string, string>;
  /** Sections: allowed first path segments for nested pages, e.g. ['ratgeber']. If set → every page with
   *  two or more levels must be inside a section (/ratgeber/…/), otherwise the build fails. Empty = no restriction. */
  sections?: string[];
  /** Default preview image (Open Graph, 1200×630) for pages without their own image. Default: /og.png (public/og.png).
   *  The live build fails if the file is missing. */
  ogImage?: string;
  /** Installable app via pwa-kit (default: off). true → after every build: manifest, icons, offline page and
   *  sw.js from pwa.config.json; requires pwa-kit/ and pwa.config.json in the project (deploy-tool pwa-sync <ID>). */
  pwa?: boolean;
  /** Additional noindex paths (e.g. "/suche/") */
  noindex?: string[];
  themeColor?: string;
}

export function defineSite(config: SiteConfig): SiteConfig {
  return config;
}

/** Main domain from site.config.ts: protocol + host, no trailing / (e.g. https://www.rufnak.de). Fails the build otherwise. */
export function siteUrl(site: SiteConfig): string {
  if (!/^https?:\/\/[^/?#\s]+$/.test(site.url)) {
    throw new Error(`site.config.ts: url '${site.url}' muss die Hauptdomain ohne / am Ende sein (z. B. https://www.rufnak.de).`);
  }
  return site.url;
}

/** Path of the default preview image */
export function ogImagePath(site: SiteConfig): string {
  const p = site.ogImage ?? '/og.png';
  if (!p.startsWith('/')) throw new Error(`site.config.ts: ogImage '${p}' muss ein Pfad sein (z. B. /og.png).`);
  return p;
}

/** GA4 measurement ID if analytics is enabled, otherwise undefined. Fails the build on an invalid ID. */
export function analyticsId(site: SiteConfig): string | undefined {
  if (site.analytics?.enabled !== true) return undefined;
  const id = site.analytics.ga4Id ?? '';
  if (!/^G-[A-Z0-9]+$/.test(id)) {
    throw new Error(`site.config.ts: analytics.enabled ist true, aber ga4Id '${id}' ist keine gültige GA4-Mess-ID (z. B. G-ABC123).`);
  }
  return id;
}

/** Imprint data with resolved email */
export type ResolvedLegalInfo = LegalInfo & { email: string };

/** Project domain without www, in Unicode and ASCII spelling (punycode) */
export function siteDomain(site: SiteConfig): { unicode: string; ascii: string } {
  const host = new URL(site.url).hostname.replace(/^www\./, '');
  const ascii = domainToASCII(host) || host;
  return { unicode: domainToUnicode(ascii) || ascii, ascii };
}

/** ASCII spelling of an email (domain part as punycode), e.g. for mail() and forms */
export function asciiEmail(email: string): string {
  const at = email.lastIndexOf('@');
  if (at < 0) return email;
  const domain = email.slice(at + 1);
  return `${email.slice(0, at)}@${domainToASCII(domain) || domain}`;
}

/** Imprint data: central operator data (operator.ts), overridden by site.config.ts → legal.
 *  Email if not given: info@<project domain>; for umlaut domains also the punycode spelling as emailAlt. */
export function legalInfo(site: SiteConfig): ResolvedLegalInfo {
  const merged = { ...operator, ...(site.legal ?? {}) };
  const email = merged.email ?? `info@${siteDomain(site).unicode}`;
  const ascii = asciiEmail(email);
  const emailAlt = merged.emailAlt ?? (ascii !== email ? ascii : undefined);
  return { ...merged, email, emailAlt };
}

/** true if the contact form is enabled */
export function contactEnabled(site: SiteConfig): boolean {
  return site.contact?.enabled === true;
}
