<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Sanitize & trim inputs
    $name = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $phone = trim($_POST['phone'] ?? '');
    $subject = trim($_POST['subject'] ?? 'New Contact Message');
    $product = trim($_POST['productInterest'] ?? '');
    $message = trim($_POST['message'] ?? '');

    // Basic validation
    if (empty($name) || empty($email) || empty($message)) {
        echo "<h3 style='color:red;'>Please fill in all required fields (Name, Email, Message).</h3>";
        exit;
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo "<h3 style='color:red;'>Invalid email format.</h3>";
        exit;
    }

    try {
        /* ===================================================
           1️⃣ SEND MAIL TO ADMIN (HTML + branded)
        =================================================== */

        $adminMail = new PHPMailer(true);
        $adminMail->isSMTP();
        $adminMail->Host = 'smtp.hostinger.com';
        $adminMail->SMTPAuth = true;
        $adminMail->Username = 'info@texainnovates.com';
        $adminMail->Password = 'Texa@4887!'; // App Password – keep secret!
        $adminMail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $adminMail->Port = 465;

        $adminMail->setFrom('info@texainnovates.com', 'TEXA Innovates Website');
        $adminMail->addAddress('info@texainnovates.com'); // Admin email
        // Optional: $adminMail->addReplyTo($email, $name); // lets admin reply directly to user

        $adminMail->isHTML(true);
        $adminMail->Subject = $subject ?: 'New Enquiry from Website';

        $adminMail->Body = '
                            <!DOCTYPE html>
                            <html lang="en">
                            <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>New Enquiry - TEXA Innovates</title>
                            <style type="text/css">
                                body{margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;background:#f4f4f4;-webkit-font-smoothing:antialiased;}
                                table{border-collapse:collapse;}
                                .wrapper{width:100%;background:#f4f4f4;padding:20px 0;}
                                .container{max-width:600px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,.08);}
                                .header{background:#722F37;padding:32px 40px;text-align:center;}
                                .header h1{color:#fff;margin:0;font-size:26px;font-weight:600;}
                                .content{padding:40px;color:#333;line-height:1.6;font-size:16px;}
                                .label{color:#722F37;font-weight:bold;display:inline-block;width:140px;vertical-align:top;padding-right:12px;}
                                .value{color:#1a1a1a;}
                                .message-box{background:#f9f9f9;border-left:4px solid #722F37;padding:20px;margin:24px 0;white-space:pre-wrap;word-wrap:break-word;}
                                .footer{background:#f8f8f8;padding:24px 40px;text-align:center;font-size:13px;color:#666;border-top:1px solid #eee;}
                                .footer a{color:#722F37;text-decoration:none;}
                                @media only screen and (max-width:480px){.content,.header{padding:28px 20px !important;}.label{display:block;width:100%;margin-bottom:6px;}}
                            </style>
                            </head>
                            <body>
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" class="wrapper">
                                <tr><td align="center">
                                <table cellpadding="0" cellspacing="0" border="0" class="container">
                                    <tr><td class="header"><h1>New Enquiry Received</h1></td></tr>
                                    <tr><td class="content">
                                    <p>Dear Admin,</p>
                                    <p>You have received a new enquiry:</p>
                                    <table width="100%" cellpadding="8" cellspacing="0" border="0">
                                        <tr><td class="label">Name:</td><td class="value">' . htmlspecialchars($name) . '</td></tr>
                                        <tr><td class="label">Email:</td><td class="value">' . htmlspecialchars($email) . '</td></tr>
                                        <tr><td class="label">Phone:</td><td class="value">' . htmlspecialchars($phone) . '</td></tr>
                                        <tr><td class="label">Product Interest:</td><td class="value">' . htmlspecialchars($product) . '</td></tr>
                                    </table>
                                    <div class="message-box">
                                        <strong>Message:</strong><br><br>' . nl2br(htmlspecialchars($message)) . '
                                    </div>
                                    <p style="margin-top:32px;">You can reply directly to this email to contact the sender.</p>
                                    </td></tr>
                                    <tr><td class="footer">
                                    <strong>TEXA Innovates</strong><br>
                                    #438-A, Kamarajar Road, Lakshmipuram, Peelamedu<br>
                                    Coimbatore - 641 004, Tamil Nadu, India<br><br>
                                    <a href="tel:+919585544887">+91 95855 44887</a> | 
                                    <a href="tel:+919944557561">+91 99445 57561</a><br>
                                    <a href="mailto:info@texainnovates.com">info@texainnovates.com</a> | 
                                    <a href="https://texainnovates.com">texainnovates.com</a><br><br>
                                    © ' . date("Y") . ' TEXA Innovates. All rights reserved.<br>
                                    Automated notification – no need to reply.
                                    </td></tr>
                                </table>
                                </td></tr>
                            </table>
                            </body>
                            </html>';
        // Optional plain-text fallback
        $adminMail->AltBody = "Name: $name\nEmail: $email\nPhone: $phone\nProduct: $product\n\nMessage:\n$message";

        $adminMail->send();

        /* ===================================================
           2️⃣ SEND THANK YOU MAIL TO USER (now branded HTML)
        =================================================== */

        $userMail = new PHPMailer(true);
        $userMail->isSMTP();
        $userMail->Host = 'smtp.hostinger.com';
        $userMail->SMTPAuth = true;
        $userMail->Username = 'info@texainnovates.com';
        $userMail->Password = 'Texa@4887!';
        $userMail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $userMail->Port = 465;

        $userMail->setFrom('info@texainnovates.com', 'TEXA Innovates');
        $userMail->addAddress($email, $name);
        // Optional: $userMail->addReplyTo('info@texainnovates.com', 'TEXA Support');

        $userMail->isHTML(true);
        $userMail->Subject = 'Thank You for Reaching Out - TEXA Innovates';

        $userMail->Body = '
                        <!DOCTYPE html>
                        <html lang="en">
                        <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Thank You - TEXA Innovates</title>
                        <style type="text/css">
                            body{margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;background:#f4f4f4;}
                            .container{max-width:600px;margin:20px auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,.08);}
                            .header{background:#722F37;padding:40px 30px;text-align:center;color:#fff;}
                            .header h1{margin:0;font-size:28px;}
                            .wrapper{width:100%;background:#f4f4f4;padding:20px 0;}
                            .content{padding:40px;color:#333;line-height:1.6;font-size:16px;}
                            .btn{display:inline-block;background:#722F37;color:#fff;padding:12px 24px;text-decoration:none;border-radius:4px;margin:20px 0;}
                            .footer{background:#f8f8f8;padding:24px;text-align:center;font-size:13px;color:#666;border-top:1px solid #eee;}
                            .footer a{color:#722F37;text-decoration:none;}
                        </style>
                        </head>
                        <body>
                        <table width="100%" cellpadding="0" cellspacing="0" border="0 " class="wrapper">
                            <tr><td align="center">
                            <table class="container" cellpadding="0" cellspacing="0" border="0">
                                <tr><td class="header"><h1>Thank You, ' . htmlspecialchars($name) . '!</h1></td></tr>
                                <tr><td class="content">
                                <p>We have received your enquiry and appreciate you reaching out to TEXA Innovates.</p>
                                <p>Our team will review your message and get back to you as soon as possible — usually within 24-48 hours.</p>
                                <p><strong>Your submitted details:</strong></p>
                                <ul style="list-style:none;padding-left:0;">
                                    <li><strong>Product Interest:</strong> ' . htmlspecialchars($product ?: 'Not specified') . '</li>
                                    <li><strong>Message summary:</strong> ' . htmlspecialchars(substr($message, 0, 150)) . (strlen($message) > 150 ? '...' : '') . '</li>
                                </ul>
                                <p style="text-align:center;">
                                    <a href="https://texainnovates.com" class="btn" style="text-decoration:none; color:#fff;">Visit Our Website</a>
                                </p>
                                </td></tr>
                                <tr><td class="footer">
                                <strong>TEXA Innovates</strong><br>
                                #438-A, Kamarajar Road, Lakshmipuram, Peelamedu, Coimbatore - 641 004<br>
                                <a href="mailto:info@texainnovates.com">info@texainnovates.com</a> | +91 95855 44887<br><br>
                                © ' . date("Y") . ' TEXA Innovates. All rights reserved.
                                </td></tr>
                            </table>
                            </td></tr>
                        </table>
                        </body>
                        </html>';

        $userMail->AltBody = "Hi $name,\n\nThank you for contacting TEXA Innovates.\nWe have received your message and will get back to you soon.\n\nBest regards,\nTEXA Innovates Team\nhttps://texainnovates.com";

        $userMail->send();

        echo "<h3>Thank you! Your message has been sent successfully.<br>We will get back to you soon.</h3>";

    } catch (Exception $e) {
        echo "<h3 style='color:red; text-align:center;'>Error sending message: {$e->getMessage()}</h3>";
    }
}
?>
