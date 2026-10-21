// Inhalte von rufnak.de (Lebenslauf, Kenntnisse, Kontakt) – Texte zeitlos halten, Arbeitgeber nur im Werdegang.

export const kontakt = {
  email: 'enrico@rufnak.de',
  mobil: '0177 / 42 33 525',
  mobilKopie: '0177 4233525',
  tel: '+491774233525',
  strasse: 'Günther-Simon-Str. 13',
  ort: '14480 Potsdam',
  geburtstag: '29.09.1984',
};

// Profile (Links wie auf der alten Seite)
export const profile = [
  { name: 'GitHub', url: 'https://github.com/enricorufnak' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/enricorufnak' },
  { name: 'Xing', url: 'https://www.xing.com/profile/Enrico_Rufnak' },
];

export const sidebarSkills = ['PHP', 'Java', 'TypeScript', 'Angular', 'SQL', 'Laravel', 'Android', 'JavaScript'];

export const eigenschaften = [
  { titel: 'Zielorientiert', text: 'Ich arbeite auf ein klares Ergebnis hin und behalte es im Blick.' },
  { titel: 'Analytisch', text: 'Erst verstehen, dann bauen. Fehler finde ich gern an der Wurzel.' },
  { titel: 'Flexibel', text: 'Neue Werkzeuge und Anforderungen gehören für mich dazu.' },
];

export const werdegang = [
  { von: '08/2018', bis: 'heute', firma: 'commsult AG', rolle: 'Softwareentwickler', notiz: '' },
  {
    von: '10/2014', bis: '07/2018', firma: 'bytepark GmbH, Berlin', rolle: 'Webentwickler',
    notiz: 'Webanwendungen auf Basis von PHP-Frameworks, WordPress, Sulu und Drupal, eigene REST- und RPC-APIs mit Authentifizierung, Ausbau von Continuous Integration, Virtualisierung und Automatisierung.',
  },
  {
    von: '04/2012', bis: '10/2014', firma: 'Kreowsky & Kreowsky GbR, Berlin', rolle: 'Webentwickler',
    notiz: 'Hauptentwickler in Kundenprojekten: Anforderungsanalyse und Aufwandsschätzung, Webanwendungen mit PHP und MySQL, E-Commerce, Usability und technische Kundenberatung.',
  },
  { von: '11/2011', bis: '01/2012', firma: 'why-home.com, Berlin', rolle: 'Softwareentwickler', notiz: '' },
  {
    von: '06/2003', bis: '06/2011', firma: 'der Deutschen Marine', rolle: 'Unteroffizier, Soldat auf Zeit',
    notiz: 'Operationsdienst mit computergestützten Systemen, später Personalbearbeitung im Stabsdienst. Ausbildung in Menschenführung.',
  },
];

export const ausbildung = [
  {
    von: '01/2011', bis: '08/2011', abschluss: 'Web-Zertifikate (WE Certified)',
    ort: 'Web Developer, Web Designer, Webmaster, Web Administrator, Web Business Manager',
    themen: ['PHP & OOP', 'MySQL', 'Linux-Administration', 'Usability', 'Projektmanagement'],
  },
  {
    von: '10/2005', bis: '06/2007', abschluss: 'Fachinformatiker für Systemintegration',
    ort: 'Bildungswerk der Niedersächsischen Wirtschaft, Wilhelmshaven', themen: [],
  },
];

export const zertifikate = [
  { name: 'Web Designer Grad II', von: 'WE Certified', datum: '07/2011' },
  { name: 'Webmaster', von: 'WE Certified', datum: '05/2011' },
  { name: 'Web Administrator', von: 'WE Certified', datum: '05/2011' },
  { name: 'Web Developer Grad I', von: 'WE Certified', datum: '04/2011' },
  { name: 'Web Designer Grad I', von: 'WE Certified', datum: '03/2011' },
  { name: 'Web Business Manager', von: 'WE Certified', datum: '02/2011' },
  { name: 'English for Business', von: 'LCCI', datum: '10/2009' },
  { name: 'Fachinformatiker Systemintegration', von: 'IHK', datum: '06/2007' },
];

export const kenntnisse = [
  { gruppe: 'Backend', liste: ['PHP', 'Java', 'OOP', 'PDO', 'Laravel', 'Symfony', 'Smarty', 'Twig', 'Blade', 'Composer', 'REST- & RPC-APIs'] },
  { gruppe: 'Datenbanken & Caching', liste: ['MySQL', 'MS SQL Server', 'PostgreSQL', 'Redis', 'Varnish'] },
  { gruppe: 'Frontend', liste: ['Angular', 'Angular Material', 'TypeScript', 'JavaScript', 'HTML5', 'CSS', 'jQuery', 'Ajax', 'Bootstrap'] },
  { gruppe: 'Mobile', liste: ['Android (nativ & hybrid)', 'Cordova'] },
  {
    gruppe: 'Build & DevOps',
    liste: ['Gradle', 'Maven', 'Git', 'GitLab', 'Jenkins', 'Docker', 'Vagrant', 'Ansible', 'Linux', 'Apache', 'Nginx', 'Continuous Integration', 'Continuous Delivery'],
  },
  { gruppe: 'Qualität & Tests', liste: ['PHPUnit', 'Codeception', 'TDD', 'BDD'] },
  { gruppe: 'Werkzeuge, CMS & Shop', liste: ['Eclipse', 'PhpStorm', 'Jira', 'WordPress', 'Drupal', 'Sulu CMF', 'Shopware'] },
  {
    gruppe: 'KI-gestütztes Arbeiten',
    liste: ['GitHub Copilot', 'ChatGPT', 'Claude', 'Gemini', 'Prompting', 'KI-gestützte Entwicklung', 'Agenten-Workflows'],
    notiz: 'Je nach Aufgabe das passende Werkzeug: von der Ideenfindung über die Planung bis zu Code und Review.',
  },
];

export const sprachen = [
  { sprache: 'Deutsch', niveau: 'Muttersprache' },
  { sprache: 'Englisch', niveau: 'verhandlungssicher' },
  { sprache: 'Französisch', niveau: 'Grundkenntnisse' },
];

export const stimmen = [
  { zitat: 'Durch seine hervorragende Auffassungsgabe konnte er sich sehr schnell in neue Aufgaben einarbeiten und war dadurch vielseitig einsetzbar.', quelle: 'Kreowsky & Kreowsky GbR' },
  { zitat: 'Wir lernten ihn als jemanden kennen, der sich durch eine konstruktive Haltung verbunden mit kritischem Sachverstand und sehr guten analytischen Fähigkeiten auszeichnete.', quelle: 'bytepark GmbH' },
  { zitat: 'Er schaut über den Tellerrand seines Fachgebietes hinaus und berücksichtigt die Gesamtzusammenhänge.', quelle: 'Deutsche Marine' },
];
