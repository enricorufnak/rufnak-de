// Von astro-kit verwaltet (kit-sync überschreibt diese Datei). Änderungen per PR im astro-kit.
// 301-Weiterleitungen je Projekt (site.config.ts → redirects), z. B. alte URLs nach einem Relaunch.
// Läuft im Build: schreibt die Regeln in dist/.htaccess an die Stelle von "# KIT_REDIRECTS",
// vor der www-Regel – jede alte URL landet in einem Sprung auf https://www.<domain>/<neu>/.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { AstroIntegration } from 'astro';
import { site } from '../../site.config';
import { normalizePath } from './seo';
import { STANDARD_PATH } from './urls';

export const REDIRECTS_MARKER = '# KIT_REDIRECTS';

const regexEscape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Gebaute Seite zum Pfad vorhanden? (/neu/ → neu/index.html, / → index.html) */
function pageExists(distDir: string, path: string): boolean {
  return existsSync(join(distDir, path.slice(1), 'index.html'));
}

/** Prüft die Weiterleitungen und liefert die RewriteRules; wirft bei Fehlern (Build bricht ab). */
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
    // mit und ohne / am Ende; Apache prüft den Pfad ohne führenden /
    rules.push(`  RewriteRule ^${regexEscape(bare.slice(1))}/?$ ${siteUrl}${to} [R=301,L,NE]`);
  }
  if (errors.length) throw new Error('site.config.ts → redirects:\n  - ' + errors.join('\n  - '));
  return rules;
}

/** Integration: Regeln nach dem Build in dist/.htaccess eintragen */
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
