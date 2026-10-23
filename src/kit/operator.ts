// Managed by astro-kit (kit-sync overwrites this file). Changes via PR in astro-kit.
// Central operator data for imprint and privacy policy of ALL projects.
// To change (e.g. after moving): here via PR in astro-kit, then `deploy-tool kit-sync <ID>` per project.
// Overrides for a single project: site.config.ts → legal (overrides individual fields).
// As long as TODO appears here or in the project, the build fails with live: true (check-indexing.mjs).
import type { LegalInfo } from './types';

export const operator: LegalInfo = {
  owner: 'Enrico Rufnak',
  street: 'Günther-Simon-Str. 13',
  zip: '14480',
  city: 'Potsdam',
  country: 'Deutschland',
  // email: defaults to info@<project domain> (types.ts → legalInfo); can be overridden per project in site.config.ts → legal
  // phone: '',
  // vatId: 'DE…',            // VAT ID, only if available
  // legalForm: '',           // e.g. 'Einzelunternehmen' – only if wanted/required
  // register: { court: 'Amtsgericht …', number: 'HRB …' },
  // Consumer dispute resolution notice (§ 36 VSBG): 'unwilling' = "not willing or obliged"
  consumerDispute: 'unwilling',
  // KAS → Settings → Logs & statistics (inherited by all accounts, as of 2026-10-20)
  serverLogs: { ip: 'full', retentionDays: 7, statistics: true },
  // Data protection authority at the operator's location (Brandenburg)
  supervisoryAuthority: {
    name: 'Die Landesbeauftragte für den Datenschutz und für das Recht auf Akteneinsicht Brandenburg',
    address: 'Stahnsdorfer Damm 77, 14532 Kleinmachnow',
  },
};
