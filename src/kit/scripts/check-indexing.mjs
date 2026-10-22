// Managed by astro-kit (kit-sync overwrites this file). Changes via PR in astro-kit.
// Checks the finished build (dist/) against the indexing standard:
//  - every page with robots noindex is missing from the sitemap
//  - every indexable page is in the sitemap (except 404)
//  - imprint and privacy policy exist, are indexable and in the sitemap
//  - robots.txt points to the sitemap
//  - with live: true no TODO entries in the imprint
// Usage: node src/kit/scripts/check-indexing.mjs [dist]
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const dist = process.argv[2] ?? 'dist';
const errors = [];

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

function pagePath(file) {
  let p = '/' + relative(dist, file).split(sep).join('/');
  if (p.endsWith('/index.html')) p = p.slice(0, -'index.html'.length);
  else if (p.endsWith('.html')) p = p.slice(0, -'.html'.length) + '/';
  return p;
}

function locs(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

if (!existsSync(join(dist, 'sitemap-index.xml'))) {
  console.error(`✗ ${dist}/sitemap-index.xml fehlt (ist @astrojs/sitemap eingebunden?)`);
  process.exit(1);
}

const sitemapUrls = new Set();
for (const sm of locs(readFileSync(join(dist, 'sitemap-index.xml'), 'utf8'))) {
  const file = join(dist, new URL(sm).pathname);
  if (!existsSync(file)) {
    errors.push(`Sitemap ${new URL(sm).pathname} fehlt im Build`);
    continue;
  }
  for (const u of locs(readFileSync(file, 'utf8'))) sitemapUrls.add(new URL(u).pathname);
}

const pages = walk(dist).filter((f) => f.endsWith('.html'));
let indexable = 0;
let noindexCount = 0;
for (const file of pages) {
  const path = pagePath(file);
  const html = readFileSync(file, 'utf8');
  const robots = html.match(/<meta\s+name=["']robots["']\s+content=["']([^"']*)["']/i)?.[1] ?? '';
  const noindex = /noindex/i.test(robots);
  const inSitemap = sitemapUrls.has(path);
  if (noindex) {
    noindexCount++;
    if (inSitemap) errors.push(`${path} ist noindex, steht aber in der Sitemap`);
  } else {
    indexable++;
    if (path !== '/404/' && !inSitemap) errors.push(`${path} ist indexierbar, fehlt aber in der Sitemap`);
  }
  if (!robots) errors.push(`${path} hat kein <meta name="robots"> (BaseLayout verwenden)`);
}

for (const legal of ['/impressum/', '/datenschutz/']) {
  const file = join(dist, legal, 'index.html');
  if (!existsSync(file)) {
    errors.push(`${legal} fehlt`);
    continue;
  }
  if (/<meta\s+name=["']robots["']\s+content=["'][^"']*noindex/i.test(readFileSync(file, 'utf8'))) {
    errors.push(`${legal} muss indexierbar sein`);
  }
  if (!sitemapUrls.has(legal)) errors.push(`${legal} muss in der Sitemap stehen`);
}

// Going live (home page indexable) only with a complete imprint
const home = join(dist, 'index.html');
const homeLive = existsSync(home) && !/<meta\s+name=["']robots["']\s+content=["'][^"']*noindex/i.test(readFileSync(home, 'utf8'));
const impressum = join(dist, 'impressum', 'index.html');
if (homeLive && existsSync(impressum) && /TODO/.test(readFileSync(impressum, 'utf8'))) {
  errors.push('Seite ist live (live: true), aber das Impressum enthält noch TODO-Angaben (src/kit/operator.ts bzw. site.config.ts → legal)');
}

const robotsFile = join(dist, 'robots.txt');
if (!existsSync(robotsFile) || !/Sitemap:\s*https?:\/\/\S+\/sitemap-index\.xml/.test(readFileSync(robotsFile, 'utf8'))) {
  errors.push('robots.txt fehlt oder verweist nicht auf /sitemap-index.xml');
}

if (errors.length) {
  console.error(`✗ Indexierungs-Prüfung: ${errors.length} Fehler`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log(`✓ Indexierungs-Prüfung: ${indexable} indexierbar, ${noindexCount} noindex, Sitemap stimmt`);
