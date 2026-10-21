// Von astro-kit verwaltet (kit-sync überschreibt diese Datei). Änderungen per PR im astro-kit.

export interface NavItem {
  label: string;
  href: string;
}

import { domainToASCII, domainToUnicode } from 'node:url';
import { operator } from './operator';

export interface LegalInfo {
  /** Name des Betreibers (natürliche Person oder Firma) */
  owner: string;
  street: string;
  zip: string;
  city: string;
  country?: string;
  /** E-Mail im Impressum. Standard: info@<Projektdomain> (aus site.url, ohne www) */
  email?: string;
  /** Zweite Schreibweise der E-Mail, z. B. Punycode bei Umlaut-Domains.
   *  Standard: automatisch info@xn--… , wenn die Domain Umlaute enthält; sonst keine. */
  emailAlt?: string;
  phone?: string;
  /** USt-IdNr., falls vorhanden */
  vatId?: string;
  /** Rechtsform, falls angegeben werden soll (z. B. Einzelunternehmen, UG) */
  legalForm?: string;
  /** Vertretungsberechtigte Person (bei Gesellschaften/Vereinen) */
  representative?: string;
  /** Registereintrag (Handels-/Vereinsregister) */
  register?: { court: string; number: string };
  /** Verantwortlich nach § 18 Abs. 2 MStV (journalistisch-redaktionelle Inhalte, z. B. Ratgeber); Anschrift wie Betreiber, falls nicht angegeben */
  responsible?: { name: string; address?: string };
  /** Hinweis zur Verbraucherstreitbeilegung (§ 36 VSBG): 'unwilling' = nicht bereit/verpflichtet, 'none' = kein Hinweis */
  consumerDispute?: 'unwilling' | 'none';
  /** Zuständige Datenschutz-Aufsichtsbehörde (Sitz des Betreibers), erscheint im Datenschutz beim Beschwerderecht */
  supervisoryAuthority?: { name: string; address: string };
  /** Server-Logs laut KAS (Einstellungen → Logs & Statistiken), erscheint im Datenschutz.
   *  ip: 'full' = vollständig, 'shortened' = 11.22.0.0, 'anonymized' = 0.0.0.0, 'none' = keine Logs;
   *  retentionDays: Aufbewahrungsdauer; statistics: Zugriffsstatistik aus den Logs */
  serverLogs?: { ip: 'full' | 'shortened' | 'anonymized' | 'none'; retentionDays: number; statistics?: boolean };
}

export interface SiteConfig {
  /** Projekt-ID, z. B. P01 */
  id: string;
  name: string;
  /** Live-Adresse ohne Schrägstrich am Ende, z. B. https://www.ehrenamtskiste.de */
  url: string;
  description: string;
  lang?: string;
  /** false = Platzhalter-Phase: alle Seiten außer Impressum/Datenschutz noindex */
  live: boolean;
  nav: NavItem[];
  /** Abweichungen von den zentralen Betreiberdaten (src/kit/operator.ts); nur geänderte Felder angeben */
  legal?: Partial<LegalInfo>;
  /** Google Analytics 4 (Standard: aus). Aktiv nur mit enabled: true und gültiger ga4Id;
   *  geladen wird GA erst nach Einwilligung im Banner. */
  analytics?: { enabled: boolean; ga4Id?: string };
  /** Kontaktformular (Standard: aus). enabled: true legt /kontakt/ an (Formular → kontakt.php).
   *  to: Empfänger (Standard: legal.email, als ASCII/Punycode)
   *  from: Absender – muss bei All-Inkl ein existierendes Postfach/Alias der Domain sein (Standard: noreply@domain) */
  contact?: { enabled: boolean; to?: string; from?: string };
  /** 301-Weiterleitungen alt → neu, z. B. { '/ueber.html': '/ueber-mich/' }.
   *  Alt: beliebiger alter Pfad; neu: Pfad nach URL-Standard, den es im Build gibt. Bestehende URLs nie still ändern. */
  redirects?: Record<string, string>;
  /** Rubriken: erlaubte erste Pfad-Segmente für Unterseiten, z. B. ['ratgeber']. Gesetzt → jede Seite mit
   *  zwei oder mehr Ebenen muss in einer Rubrik liegen (/ratgeber/…/), sonst bricht der Build ab. Leer = keine Vorgabe. */
  sections?: string[];
  /** Standard-Vorschaubild (Open Graph, 1200×630) für Seiten ohne eigenes Bild. Standard: /og.png (public/og.png).
   *  Live-Build bricht ab, wenn die Datei fehlt. */
  ogImage?: string;
  /** Installierbare App über pwa-kit (Standard: aus). true → nach jedem Build Manifest, Icons, Offline-Seite und
   *  sw.js aus pwa.config.json; braucht pwa-kit/ und pwa.config.json im Projekt (deploy-tool pwa-sync <ID>). */
  pwa?: boolean;
  /** Pfade, die zusätzlich noindex sind (z. B. "/suche/") */
  noindex?: string[];
  themeColor?: string;
}

export function defineSite(config: SiteConfig): SiteConfig {
  return config;
}

/** Pfad des Standard-Vorschaubilds */
export function ogImagePath(site: SiteConfig): string {
  const p = site.ogImage ?? '/og.png';
  if (!p.startsWith('/')) throw new Error(`site.config.ts: ogImage '${p}' muss ein Pfad sein (z. B. /og.png).`);
  return p;
}

/** GA4-Mess-ID, wenn Analytics aktiv ist, sonst undefined. Bricht den Build bei ungültiger ID ab. */
export function analyticsId(site: SiteConfig): string | undefined {
  if (site.analytics?.enabled !== true) return undefined;
  const id = site.analytics.ga4Id ?? '';
  if (!/^G-[A-Z0-9]+$/.test(id)) {
    throw new Error(`site.config.ts: analytics.enabled ist true, aber ga4Id '${id}' ist keine gültige GA4-Mess-ID (z. B. G-ABC123).`);
  }
  return id;
}

/** Impressumsdaten mit aufgelöster E-Mail */
export type ResolvedLegalInfo = LegalInfo & { email: string };

/** Projektdomain ohne www, in Unicode- und ASCII-Schreibweise (Punycode) */
export function siteDomain(site: SiteConfig): { unicode: string; ascii: string } {
  const host = new URL(site.url).hostname.replace(/^www\./, '');
  const ascii = domainToASCII(host) || host;
  return { unicode: domainToUnicode(ascii) || ascii, ascii };
}

/** ASCII-Schreibweise einer E-Mail (Domainteil als Punycode), z. B. für mail() und Formulare */
export function asciiEmail(email: string): string {
  const at = email.lastIndexOf('@');
  if (at < 0) return email;
  const domain = email.slice(at + 1);
  return `${email.slice(0, at)}@${domainToASCII(domain) || domain}`;
}

/** Impressumsdaten: zentrale Betreiberdaten (operator.ts), überschrieben durch site.config.ts → legal.
 *  E-Mail ohne Angabe: info@<Projektdomain>; bei Umlaut-Domains zusätzlich die Punycode-Schreibweise als emailAlt. */
export function legalInfo(site: SiteConfig): ResolvedLegalInfo {
  const merged = { ...operator, ...(site.legal ?? {}) };
  const email = merged.email ?? `info@${siteDomain(site).unicode}`;
  const ascii = asciiEmail(email);
  const emailAlt = merged.emailAlt ?? (ascii !== email ? ascii : undefined);
  return { ...merged, email, emailAlt };
}

/** true, wenn das Kontaktformular aktiv ist */
export function contactEnabled(site: SiteConfig): boolean {
  return site.contact?.enabled === true;
}
