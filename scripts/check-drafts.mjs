// Owned by the project. Checks the finished build (dist/) for leaked project drafts:
// a draft (draft: true or no draft field) must have no page and must not be linked or described anywhere.
// Checked per draft: dist/projekte/<slug>/, the path /projekte/<slug>/ and its "beschreibung" text in any built file.
// Usage: node scripts/check-drafts.mjs [dist]
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, join } from 'node:path';

const dist = process.argv[2] ?? 'dist';
const contentDir = 'src/content/projekte';

// Minimal front matter reader for single-line "key: value" entries
function frontMatter(file) {
  const fm = readFileSync(file, 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
  const get = (key) => {
    const v = fm.match(new RegExp(`^${key}:\\s*(.*)$`, 'm'))?.[1].trim();
    return v?.replace(/^(['"])(.*)\1$/, '$2');
  };
  return { draft: get('draft') !== 'false', beschreibung: get('beschreibung') };
}

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

const drafts = existsSync(contentDir)
  ? readdirSync(contentDir)
      .filter((f) => f.endsWith('.md'))
      .map((f) => ({ slug: basename(f, '.md'), ...frontMatter(join(contentDir, f)) }))
      .filter((p) => p.draft)
  : [];

const files = walk(dist)
  .filter((f) => /\.(html|xml|txt|json|js|css)$/.test(f))
  .map((f) => ({ f, text: readFileSync(f, 'utf8') }));

const errors = [];
for (const d of drafts) {
  if (existsSync(join(dist, 'projekte', d.slug))) errors.push(`/projekte/${d.slug}/ was built although it is a draft`);
  const needles = [`/projekte/${d.slug}/`, d.beschreibung].filter(Boolean);
  for (const { f, text } of files) {
    for (const n of needles) if (text.includes(n)) errors.push(`${f} contains "${n}" (draft ${d.slug})`);
  }
}

if (errors.length) {
  console.error(`✗ Draft check: ${errors.length} error(s)`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log(`✓ Draft check: ${drafts.length} draft(s), none in the build`);
