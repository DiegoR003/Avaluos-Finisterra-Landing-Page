<?php
// /api/send-mail.php
// Respuesta JSON siempre
header('Content-Type: application/json; charset=UTF-8');

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/../vendor/autoload.php';

/* ========== CONFIG ==========
   Se usan credenciales del proveedor  (cPanel/SMTP del dominio, Gmail SMTP, etc.)
*/
const SMTP_HOST = 'smtp.tu-dominio.com';
const SMTP_PORT = 587;                // 587 (TLS) o 465 (SSL)
const SMTP_USER = 'no-reply@tu-dominio.com';
const SMTP_PASS = 'TU_PASSWORD_SMTP';
const SMTP_SECURE = PHPMailer::ENCRYPTION_STARTTLS; // o PHPMailer::ENCRYPTION_SMTPS

const TO_EMAIL  = ' info@avaluosfinisterra.com';      // destinatario final
const TO_NAME   = 'Avalúos Finisterra';

try {
  // Validación básica
  $nombre   = trim($_POST['nombre'] ?? '');
  $telefono = trim($_POST['telefono'] ?? '');
  $mensaje  = trim($_POST['mensaje'] ?? '');
  $hpot     = trim($_POST['website'] ?? ''); // honeypot

  if ($hpot !== '') {
    throw new Exception('Spam detectado.');
  }
  if ($nombre === '' || $telefono === '') {
    throw new Exception('Faltan campos obligatorios.');
  }

  // Sanitiza/limita
  $nombre   = mb_substr(strip_tags($nombre), 0, 120);
  $telefono = mb_substr(strip_tags($telefono), 0, 30);
  $mensaje  = mb_substr(strip_tags($mensaje), 0, 2000);

  // Metadatos útiles
  $ip  = $_SERVER['REMOTE_ADDR'] ?? 'desconocida';
  $ua  = $_SERVER['HTTP_USER_AGENT'] ?? 'desconocido';
  $now = (new DateTime('now', new DateTimeZone('America/Mazatlan')))->format('Y-m-d H:i');

//Se Construye HTML del correo
$subject = "Nueva solicitud de avalúo – {$nombre}";

$mensajeHtml = $mensaje !== '' ? nl2br(htmlentities($mensaje)) : '<em>—</em>';

$html = <<<HTML
<table style="width:100%;max-width:680px;margin:auto;border-collapse:collapse;
              font-family:Segoe UI,Roboto,Arial,sans-serif;background:#fff;color:#0f172a">
  <tr>
    <td style="padding:20px 24px;background:#0B2239;color:#fff;border-radius:10px 10px 0 0">
      <h2 style="margin:0;font-size:20px">Avalúos Finisterra</h2>
      <div style="opacity:.85;font-size:13px">Nueva solicitud de contacto</div>
    </td>
  </tr>
  <tr>
    <td style="padding:18px 24px">
      <p style="margin:0 0 10px">Hola, recibiste una solicitud desde el sitio web:</p>
      <table style="width:100%;border-collapse:collapse">
        <tr>
          <td style="padding:8px 0;width:160px;color:#64748b">Nombre</td>
          <td style="padding:8px 0"><strong>{$nombre}</strong></td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#64748b">Teléfono / WhatsApp</td>
          <td style="padding:8px 0"><strong>{$telefono}</strong></td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#64748b">Mensaje</td>
          <td style="padding:8px 0">{$mensajeHtml}</td>
        </tr>
      </table>
      <hr style="border:none;border-top:1px solid #e2e8f0;margin:16px 0">
      <table style="width:100%;border-collapse:collapse;font-size:12px;color:#64748b">
        <tr>
          <td style="padding:6px 0">Fecha</td>
          <td style="padding:6px 0">{$now}</td>
        </tr>
        <tr>
          <td style="padding:6px 0">IP</td>
          <td style="padding:6px 0">{$ip}</td>
        </tr>
        <tr>
          <td style="padding:6px 0">Navegador</td>
          <td style="padding:6px 0">{$ua}</td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td style="padding:12px 24px;background:#f8fafc;border-radius:0 0 10px 10px;color:#475569;
               font-size:12px">
      Este mensaje fue generado automáticamente desde el formulario del sitio.
    </td>
  </tr>
</table>
HTML;

 
  $text = "Nueva solicitud desde el sitio\n\n"
        . "Nombre: {$nombre}\n"
        . "Teléfono/WhatsApp: {$telefono}\n"
        . "Mensaje:\n{$mensaje}\n\n"
        . "Fecha: {$now}\nIP: {$ip}\nUA: {$ua}\n";

  // Envía con PHPMailer (SMTP)
  $mail = new PHPMailer(true);
  $mail->isSMTP();
  $mail->Host       = SMTP_HOST;
  $mail->SMTPAuth   = true;
  $mail->Username   = SMTP_USER;
  $mail->Password   = SMTP_PASS;
  $mail->SMTPSecure = SMTP_SECURE;
  $mail->Port       = SMTP_PORT;

  // Remitente (usa el mismo del SMTP)
  $mail->setFrom(SMTP_USER, 'Formulario Web');
  // Destinatario
  $mail->addAddress(TO_EMAIL, TO_NAME);

 
  // $mail->addReplyTo('cliente@correo.com', $nombre);

  $mail->Subject = $subject;
  $mail->isHTML(true);
  $mail->Body    = $html;
  $mail->AltBody = $text;

  $mail->send();

  echo json_encode(['ok' => true]);
} catch (Exception $e) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => $e->getMessage()]);
}
