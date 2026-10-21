// Single access point for the projekte collection – owned by the project.
// Drafts are never built: no page, no sitemap entry, no link (checked after the build by scripts/check-drafts.mjs).
// Exception: `npm run dev` shows drafts too (marked as "Entwurf") so they can be reviewed locally.
import { getCollection, type CollectionEntry } from 'astro:content';

export type Projekt = CollectionEntry<'projekte'>;

export const showDrafts = import.meta.env.DEV;

/** Published projects sorted by order (in dev mode including drafts) */
export async function getPublishedProjects(): Promise<Projekt[]> {
  const list = await getCollection('projekte', ({ data }) => showDrafts || !data.draft);
  return list.sort((a, b) => a.data.order - b.data.order);
}

/** Project number shown on cards and detail pages, e.g. 1 → "P01" */
export const projektNummer = (p: Projekt) => `P${String(p.data.order).padStart(2, '0')}`;

/** URL of a project's detail page */
export const projektUrl = (p: Projekt) => `/projekte/${p.id}/`;
