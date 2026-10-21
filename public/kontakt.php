<?php
// Von astro-kit verwaltet (kit-sync überschreibt diese Datei). Änderungen per PR im astro-kit.
// Kontaktformular für All-Inkl: PHP mail(), kein externer Dienst, keine Speicherung der Nachricht.
// Spam-Schutz: Honeypot, Mindest-/Höchstzeit, Limit je IP (nur Hash, max. 1 Stunde).
declare(strict_types=1);

function back(string $path, int $code = 303): never {
    header('Location: ' . $path, true, $code);
    exit;
}
function fail(): never {
    // zurück zur Seite mit dem Formular (nur gleiche Domain), sonst /kontakt/
    $ref = parse_url((string) ($_SERVER['HTTP_REFERER'] ?? ''));
    $same = isset($ref['host'], $ref['path']) && strcasecmp($ref['host'], (string) ($_SERVER['HTTP_HOST'] ?? '')) === 0;
    $path = $same && preg_match('#^/[A-Za-z0-9/_.-]*$#', $ref['path']) ? $ref['path'] : '/kontakt/';
    back($path . '?fehler=1');
}
function clean(string $v, int $max): string {
    $v = trim(str_replace("\0", '', $v));
    return mb_substr($v, 0, $max);
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    back('/', 302);
}

$cfgFile = __DIR__ . '/kontakt.json';
$cfg = is_file($cfgFile) ? json_decode((string) file_get_contents($cfgFile), true) : null;
if (!is_array($cfg) || empty($cfg['enabled']) || !filter_var($cfg['to'] ?? '', FILTER_VALIDATE_EMAIL)) {
    http_response_code(404);
    exit;
}

// Honeypot: Bots füllen das versteckte Feld aus → so tun, als wäre alles ok
if (($_POST['website'] ?? '') !== '') {
    back('/danke/');
}

// Zeitprüfung: mindestens 3 Sekunden, höchstens 1 Tag zwischen Laden und Absenden
$ts = (int) ($_POST['ts'] ?? 0);
$age = time() - $ts;
if ($ts <= 0 || $age < 3 || $age > 86400) {
    fail();
}

$name = clean((string) ($_POST['name'] ?? ''), 100);
$email = clean((string) ($_POST['email'] ?? ''), 200);
$message = clean((string) ($_POST['message'] ?? ''), 5000);
if ($name === '' || mb_strlen($message) < 10 || ($_POST['privacy'] ?? '') !== '1'
    || !filter_var($email, FILTER_VALIDATE_EMAIL) || preg_match('/[\r\n]/', $name . $email)) {
    fail();
}

// Limit: höchstens 5 Nachrichten je IP und Stunde (nur gehashte IP, Datei verfällt)
$ip = (string) ($_SERVER['REMOTE_ADDR'] ?? '');
$bucket = sys_get_temp_dir() . '/kit-form-' . hash('sha256', $ip . '|' . $cfg['domain'] . '|' . date('YmdH'));
$count = is_file($bucket) ? (int) file_get_contents($bucket) : 0;
if ($count >= 5) {
    fail();
}
@file_put_contents($bucket, (string) ($count + 1), LOCK_EX);
foreach (glob(sys_get_temp_dir() . '/kit-form-*') ?: [] as $f) {
    if (@filemtime($f) < time() - 3600) { @unlink($f); }
}

$domain = preg_replace('/[^a-z0-9.-]/i', '', (string) $cfg['domain']);
$from = filter_var($cfg['from'] ?? '', FILTER_VALIDATE_EMAIL) ? (string) $cfg['from'] : 'noreply@' . $domain;
$site = clean((string) $cfg['site'], 100);
$subject = '=?UTF-8?B?' . base64_encode("Kontaktformular $site: $name") . '?=';
$body = "Name: $name\nE-Mail: $email\n\n$message\n\n--\nGesendet über das Kontaktformular von $site";
$headers = implode("\r\n", [
    'From: ' . $site . ' <' . $from . '>',
    'Reply-To: ' . $email,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
]);

if (!mail((string) $cfg['to'], $subject, $body, $headers, '-f' . $from)) {
    fail();
}
back('/danke/');
