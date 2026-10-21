// Von astro-kit verwaltet (kit-sync überschreibt diese Datei). Änderungen per PR im astro-kit.
// Zentrale Betreiberdaten für Impressum und Datenschutz ALLER Projekte.
// Ändern (z. B. Umzug): hier per PR im astro-kit, danach `deploy-tool kit-sync <ID>` je Projekt.
// Abweichungen für ein einzelnes Projekt: site.config.ts → legal (überschreibt einzelne Felder).
// Solange hier oder im Projekt TODO steht, bricht der Build bei live: true ab (check-indexing.mjs).
import type { LegalInfo } from './types';

export const operator: LegalInfo = {
  owner: 'Enrico Rufnak',
  street: 'Günther-Simon-Str. 13',
  zip: '14480',
  city: 'Potsdam',
  country: 'Deutschland',
  // email: ohne Angabe info@<Projektdomain> (types.ts → legalInfo); je Projekt in site.config.ts → legal überschreibbar
  // phone: '',
  // vatId: 'DE…',            // USt-IdNr., nur falls vorhanden
  // legalForm: '',           // z. B. 'Einzelunternehmen' – nur angeben, wenn gewünscht/nötig
  // register: { court: 'Amtsgericht …', number: 'HRB …' },
  // Hinweis zur Verbraucherstreitbeilegung (§ 36 VSBG): 'unwilling' = „nicht bereit oder verpflichtet“
  consumerDispute: 'unwilling',
  // KAS → Einstellungen → Logs & Statistiken (für alle Accounts vererbt, Stand 2026-10-20)
  serverLogs: { ip: 'full', retentionDays: 7, statistics: true },
  // Datenschutz-Aufsicht am Sitz des Betreibers (Brandenburg)
  supervisoryAuthority: {
    name: 'Die Landesbeauftragte für den Datenschutz und für das Recht auf Akteneinsicht Brandenburg',
    address: 'Stahnsdorfer Damm 77, 14532 Kleinmachnow',
  },
};
