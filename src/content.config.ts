// Content collections of rufnak.de – owned by the project, not touched by kit-sync.
// projekte: one Markdown file per project in src/content/projekte/, file name = URL slug (/projekte/<slug>/).
// New projects start with draft: true; only getPublishedProjects() (src/lib/projekte.ts) may read this collection.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

export const kategorien = ['Vereine', 'Ratgeber', 'Tools & Rechner', 'Software & KI', 'Persönlich'] as const;

const projekte = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/projekte' }),
  schema: z.object({
    // Position in lists and project number (order 1 → "P01"); never part of the URL
    order: z.number().int().min(1),
    titel: z.string(),
    kategorie: z.enum(kategorien),
    // One sentence, used on the card, as lead and as meta description
    beschreibung: z.string(),
    // Fact box; missing fields are not rendered
    status: z.string().optional(),
    technik: z.array(z.string()).optional(),
    start: z.string().optional(),
    link: z.object({ label: z.string(), url: z.url() }).optional(),
    // Text blocks on the detail page; missing blocks are not rendered
    idee: z.string().optional(),
    umsetzung: z.string().optional(),
    gelernt: z.string().optional(),
    versionen: z.array(z.object({ jahr: z.string(), titel: z.string(), text: z.string() })).optional(),
    draft: z.boolean().default(true),
  }),
});

export const collections = { projekte };
