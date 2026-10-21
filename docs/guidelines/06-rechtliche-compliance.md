# Rechtliche Compliance – Checkliste

Stand: 21.10.2026 · **Keine Rechtsberatung.** Arbeitsliste mit üblichen Anforderungen für eine private Website in Deutschland; im Zweifel anwaltlich prüfen lassen.
Umsetzung zum größten Teil im astro-kit: Betreiberdaten `src/kit/operator.ts`, Abweichungen `site.config.ts → legal`.

## 1. Impressum (§ 5 DDG)

Ob eine reine Lebenslauf-Seite „geschäftsmäßig“ ist, ist umstritten. Die Seite dient der beruflichen Selbstdarstellung, daher gilt hier: Impressum führen.

- [x] Name, ladungsfähige Anschrift (keine Postfachadresse) – `operator.ts`
- [x] E-Mail + zweiter schneller Kontaktweg (Telefon) – `site.config.ts → legal`
- [x] Rechtsgrundlage „§ 5 DDG“ (nicht mehr TMG)
- [x] Kein veralteter Haftungs-Disclaimer (§§ 7–10 TMG)
- [x] Von jeder Seite mit einem Klick erreichbar (Footer, `LegalLinks`)
- [ ] Bei `live: true` kein „TODO“ mehr (Build bricht sonst ab)
- [ ] Redaktionelle Inhalte (z. B. Blog/Artikel) später? → Verantwortlicher nach § 18 Abs. 2 MStV ergänzen (`legal.responsible`)
- [ ] Verbraucherstreitbeilegung (§ 36 VSBG): Kit zeigt „nicht bereit oder verpflichtet“. Für eine private Seite ohne Verträge nicht nötig, schadet nicht.

## 2. Datenschutz (DSGVO, TDDDG)

- [x] Verantwortlicher mit Kontaktdaten (Art. 13 Abs. 1 lit. a)
- [x] Hosting ALL-INKL.COM, Auftragsverarbeitungsvertrag (Art. 28) abgeschlossen 02.07.2018, Kd-Nr. 512764 – `knowledge/vertraege/`
- [x] Server-Logs: Zweck, Rechtsgrundlage Art. 6 Abs. 1 lit. f, volle IP, 7 Tage, Statistik – passt zur KAS-Einstellung vom 20.10.2026
- [x] Kontakt per E-Mail/Telefon: Rechtsgrundlage, Speicherdauer
- [x] Keine Cookies, kein Zugriff auf Endgerät → kein Banner nötig (§ 25 TDDDG)
- [x] Betroffenenrechte (Art. 15–21), Beschwerderecht bei der LDA Brandenburg
- [x] Keine Drittanbieter: Fonts lokal, keine Google Maps/Analytics/CDN, keine Embeds
- [ ] **Bei jeder Änderung prüfen:** KAS-Log-Einstellung geändert → `operator.ts → serverLogs` anpassen (Kit-PR)
- [ ] Analytics aktivieren? → nur über `site.config.ts → analytics` (Kit lädt GA erst nach Einwilligung und ergänzt Datenschutz/Banner). Empfehlung: aus lassen.
- [ ] Kontaktformular aktivieren? → `contact.enabled` (Kit ergänzt Datenschutz); vorher `src/pages/kontakt.astro` entfernen
- [ ] Profil-Links (GitHub, LinkedIn, Xing) bleiben **einfache Links**, keine Widgets/Buttons der Plattformen
- [ ] Neue externe Einbindung (Video, Karte, Schrift, Skript) = Datenschutz-Abschnitt + ggf. Einwilligung nötig → vorher entscheiden
- [ ] Optional datenschutzfreundlicher: IP-Kürzung im KAS + `serverLogs.ip: 'shortened'`

## 3. Veröffentlichte persönliche Daten

Eigene Entscheidung (Shorty, 18.10.2026): Adresse, Geburtstag, Mobil, E-Mail werden gezeigt.

- [x] Geburtsdatum: keine Pflichtangabe, Risiko Identitätsdiebstahl bekannt; bleibt bewusst (Shorty, 21.10.2026)
- [ ] Keine Daten Dritter (Familie, Kolleginnen/Kollegen, Vorgesetzte) ohne deren Einwilligung
- [ ] Zeugnis-Zitate ohne Namen von Unterzeichnenden; nur Firmenname als Quelle

## 4. Urheber- und Persönlichkeitsrecht

- [x] `og.png`: Gestaltung aus `docs/og-vorlage.html` (mit KI erstellt, Shorty 21.10.2026), Schriften OFL, enthält das Profilfoto
- [x] **Profilfoto (2016):** Nutzungsrecht für Website und `og.png` vorhanden (Shorty, 21.10.2026)
- [ ] Neues Foto: Nutzungsrecht und ggf. vereinbarte Urhebernennung vorher klären
- [ ] Schriften Lora, Karla, Caveat: SIL Open Font License – Selbsthosting erlaubt ✔
- [ ] Keine fremden Bilder, Logos oder Grafiken ohne Lizenz (auch keine Firmenlogos im Werdegang)
- [ ] Firmennamen im Werdegang nur als Text (Nennung zulässig, keine Markennutzung)
- [ ] Zeugnis-Zitate: eigene Unterlagen, wörtlich, kurz – üblich unproblematisch; im Zweifel Arbeitgeber fragen
- [ ] Projekte (später): Rechte an Screenshots/Logos klären; bei fremden Marken nur Text

## 5. Arbeitsrecht / Arbeitgeber

- [ ] Kein Angebot freiberuflicher Leistungen (keine Nebentätigkeit angemeldet) – siehe Brand Styleguide
- [ ] Keine vertraulichen Informationen aus Kundenprojekten (Namen, Screenshots, Details) ohne Freigabe
- [ ] Kenntnisse aus der aktuellen Tätigkeit nicht direkt mit dem Arbeitgeber verknüpfen

## 6. Projekte und Werbung (später)

- [ ] Projekte mit Werbung, Affiliate-Links oder Einnahmen: Links kennzeichnen („Anzeige“/„Werbelink“), § 5a UWG
- [ ] Verlinkte eigene Projekte haben eigenes Impressum/Datenschutz

## 7. Barrierefreiheit

- [ ] BFSG (seit 28.06.2025) betrifft Dienstleistungen von Unternehmen an Verbraucher; private Seite ohne Angebot nach üblicher Lesart nicht erfasst. Keine Erklärung zur Barrierefreiheit Pflicht. Standard trotzdem WCAG 2.2 AA (siehe 04).

## 8. Technik mit Rechtsbezug

- [x] TLS (Let's Encrypt), HSTS
- [x] Security-Header, CSP ohne Fremdquellen
- [ ] Beim Livegang: Altlasten löschen – `public/logs/` (184 Access-Logs 2018 mit IPs, Speicherbegrenzung Art. 5 Abs. 1 lit. e), Laravel-Reste, alte `/assets/`
- [ ] Zugang des alten Feedback-Formulars (`website@rufnak.de`) prüfen, Passwort ändern oder Postfach löschen

## 9. Turnus

| Wann | Was |
|---|---|
| Jede inhaltliche Änderung | Abschnitte 2–4 dieser Liste |
| Jedes Kit-Update | Impressum/Datenschutz im Build ansehen |
| Jährlich (Oktober) | Gesetzesstand (DDG, TDDDG, DSGVO), KAS-Einstellungen, AVV, Adresse, Foto-Rechte |
| Umzug/neue Telefonnummer | `operator.ts` (Kit-PR) bzw. `site.config.ts → legal`, `profil.ts` |
