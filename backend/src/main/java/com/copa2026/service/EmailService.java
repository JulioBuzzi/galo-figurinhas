package com.copa2026.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.base-url}")
    private String baseUrl;

    @Value("${spring.mail.username}")
    private String fromEmail;

    /** Email de verificação de conta — síncrono para garantir envio */
    public void sendVerificationEmail(String toEmail, String userName, String token) {
        String verifyUrl = baseUrl + "/verify-email?token=" + token;
        String subject   = "✅ Confirme sua conta — FroSócios Figurinhas";
        String html      = buildVerificationEmail(userName, verifyUrl);
        send(toEmail, subject, html);
    }

    /** Email de reset de senha — síncrono */
    public void sendPasswordResetEmail(String toEmail, String userName, String token) {
        String resetUrl = baseUrl + "/reset-password?token=" + token;
        String subject  = "🔐 Redefinir senha — FroSócios Figurinhas";
        String html     = buildResetEmail(userName, resetUrl);
        send(toEmail, subject, html);
    }

    private void send(String to, String subject, String html) {
        try {
            log.info("📧 Enviando email para: {} | Assunto: {}", to, subject);
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom("FroSócios Figurinhas <" + fromEmail + ">");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(html, true);
            mailSender.send(message);
            log.info("✅ Email enviado com sucesso para: {}", to);
        } catch (Exception e) {
            log.error("❌ FALHA ao enviar email para {}: {} — {}", to, e.getClass().getSimpleName(), e.getMessage());
            // Lança para o chamador saber que falhou
            throw new RuntimeException("Falha ao enviar email: " + e.getMessage(), e);
        }
    }

    private String buildVerificationEmail(String name, String url) {
        return """
            <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;
                        background:#0a0a0a;border-radius:16px;overflow:hidden">
              <div style="background:linear-gradient(135deg,#0a0a0a,#2a2a2a);padding:32px;
                          text-align:center;border-bottom:3px solid #C4A135">
                <h1 style="color:#C4A135;margin:0;font-size:28px;letter-spacing:4px">FroSócios</h1>
                <p style="color:rgba(255,255,255,0.5);margin:4px 0 0;font-size:13px">
                  FIGURINHAS 2026
                </p>
              </div>
              <div style="padding:32px">
                <h2 style="color:#ffffff;margin:0 0 16px">Olá, %s! 👋</h2>
                <p style="color:rgba(255,255,255,0.7);line-height:1.6">
                  Sua conta foi criada! Clique no botão abaixo para confirmar seu email
                  e ativar a conta.
                </p>
                <div style="text-align:center;margin:32px 0">
                  <a href="%s"
                     style="background:#C4A135;color:#0a0a0a;padding:14px 32px;
                            border-radius:12px;text-decoration:none;font-weight:900;
                            font-size:15px;letter-spacing:1px;display:inline-block">
                    ✅ CONFIRMAR EMAIL
                  </a>
                </div>
                <p style="color:rgba(255,255,255,0.3);font-size:12px;text-align:center">
                  Link válido por 24 horas.<br/>Se não foi você, ignore este email.
                </p>
              </div>
            </div>
            """.formatted(name, url);
    }

    private String buildResetEmail(String name, String url) {
        return """
            <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;
                        background:#0a0a0a;border-radius:16px;overflow:hidden">
              <div style="background:linear-gradient(135deg,#0a0a0a,#2a2a2a);padding:32px;
                          text-align:center;border-bottom:3px solid #C4A135">
                <h1 style="color:#C4A135;margin:0;font-size:28px;letter-spacing:4px">FroSócios</h1>
                <p style="color:rgba(255,255,255,0.5);margin:4px 0 0;font-size:13px">
                  FIGURINHAS 2026
                </p>
              </div>
              <div style="padding:32px">
                <h2 style="color:#ffffff;margin:0 0 16px">Olá, %s! 🔐</h2>
                <p style="color:rgba(255,255,255,0.7);line-height:1.6">
                  Recebemos uma solicitação para redefinir sua senha.
                  Clique no botão abaixo para criar uma nova senha.
                </p>
                <div style="text-align:center;margin:32px 0">
                  <a href="%s"
                     style="background:#C4A135;color:#0a0a0a;padding:14px 32px;
                            border-radius:12px;text-decoration:none;font-weight:900;
                            font-size:15px;letter-spacing:1px;display:inline-block">
                    🔐 REDEFINIR SENHA
                  </a>
                </div>
                <p style="color:rgba(255,255,255,0.3);font-size:12px;text-align:center">
                  Link válido por 1 hora.<br/>Se não foi você, ignore este email.
                </p>
              </div>
            </div>
            """.formatted(name, url);
    }
}