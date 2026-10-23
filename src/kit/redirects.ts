// Managed by astro-kit (kit-sync overwrites this file). Changes via PR in astro-kit.
// 301 redirects per project (site.config.ts → redirects), e.g. old URLs after a relaunch.
// Runs during the build: writes the rules into dist/.htaccess in place of "# KIT_REDIRECTS",
// before the www rule – every old URL lands on https://www.<domain>/<new>/ in one hop.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { AstroIntegration } from 'astro';
import { site } from '../../site.config';
import { normalizePath } from './seo';
import { STANDARD_PATH } from './urls';

export const REDIRECTS_MARKER = '# KIT_REDIRECTS';

const regexEscape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Does a built page exist for the path? (/new/ → new/index.html, / → index.html) */
function pageExists(distDir: string, path: string): boolean {
  return existsSync(join(distDir, path.slice(1), 'index.html'));
}

/** Validates the redirects and returns the RewriteRules; throws on errors (build fails). */
export function redirectRules(redirects: Record<string, string>, siteUrl: string, distDir: string): string[] {
  const errors: string[] = [];
  const rules: string[] = [];
  for (const [from, to] of Object.entries(redirects)) {
    const label = `redirects['${from}']`;
    if (!from.startsWith('/') || from === '/' || /[\s?#]/.test(from)) {
      errors.push(`${label}: alte URL muss ein Pfad sein (beginnt mit /, nicht nur /, ohne Leerzeichen, ? oder #)`);
      continue;
    }
    if (!STANDARD_PATH.test(to)) {
      errors.push(`${label} → '${to}': Ziel muss ein Pfad nach URL-Standard sein (z. B. /ueber-mich/)`);
      continue;
    }
    if (!pageExists(distDir, to)) {
      errors.push(`${label} → '${to}': Zielseite gibt es im Build nicht`);
      continue;
    }
    const bare = from.replace(/\/+$/, '');
    if (pageExists(distDir, normalizePath(bare))) {
      errors.push(`${label}: unter der alten URL gibt es noch eine Seite – erst die Seite entfernen oder umbenennen`);
      continue;
    }
    if (normalizePath(bare) === to) {
      errors.push(`${label}: alte und neue URL sind gleich`);
      continue;
    }
    // with and without trailing /; Apache matches the path without the leading /
    rules.push(`  RewriteRule ^${regexEscape(bare.slice(1))}/?$ ${siteUrl}${to} [R=301,L,NE]`);
  }
  if (errors.length) throw new Error('site.config.ts → redirects:\n  - ' + errors.join('\n  - '));
  return rules;
}

/** Integration: write the rules into dist/.htaccess after the build */
export function kitRedirects(): AstroIntegration {
  return {
    name: 'kit-redirects',
    hooks: {
      'astro:build:done': ({ dir, logger }) => {
        const distDir = fileURLToPath(dir);
        const file = join(distDir, '.htaccess');
        const htaccess = readFileSync(file, 'utf8');
        if (!htaccess.includes(REDIRECTS_MARKER)) throw new Error(`.htaccess ohne Markierung '${REDIRECTS_MARKER}' – Kit-Datei verändert?`);
        const rules = redirectRules(site.redirects ?? {}, site.url.replace(/\/$/, ''), distDir);
        const block = rules.length ? `# 301-Weiterleitungen aus site.config.ts → redirects (${rules.length})\n${rules.join('\n')}` : '# keine Weiterleitungen (site.config.ts → redirects)';
        writeFileSync(file, htaccess.replace(REDIRECTS_MARKER, block));
        if (rules.length) logger.info(`${rules.length} Weiterleitung(en) in .htaccess eingetragen`);
      },
    },
  };
}
