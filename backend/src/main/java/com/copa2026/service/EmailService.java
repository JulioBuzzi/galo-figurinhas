package com.copa2026.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

/**
 * Envia emails via Resend API (HTTP) — funciona no Render free tier.
 * SMTP é bloqueado pelo Render; a API HTTP não.
 *
 * Docs: https://resend.com/docs/api-reference/emails/send-email
 */
@Service
@Slf4j
public class EmailService {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${resend.api-key}")
    private String apiKey;

    @Value("${resend.from-email}")
    private String fromEmail;

    @Value("${app.base-url}")
    private String baseUrl;

    public void sendVerificationEmail(String toEmail, String userName, String token) {
        String verifyUrl = baseUrl + "/verify-email?token=" + token;
        String subject   = "✅ Confirme sua conta — FroSócios Figurinhas";
        String html      = buildVerificationEmail(userName, verifyUrl);
        send(toEmail, subject, html);
    }

    public void sendPasswordResetEmail(String toEmail, String userName, String token) {
        String resetUrl = baseUrl + "/reset-password?token=" + token;
        String subject  = "🔐 Redefinir senha — FroSócios Figurinhas";
        String html     = buildResetEmail(userName, resetUrl);
        send(toEmail, subject, html);
    }

    private void send(String to, String subject, String html) {
        try {
            log.info("📧 Enviando email via Resend para: {} | Assunto: {}", to, subject);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            Map<String, Object> body = Map.of(
                "from",    fromEmail,
                "to",      List.of(to),
                "subject", subject,
                "html",    html
            );

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(
                "https://api.resend.com/emails",
                request,
                Map.class
            );

            log.info("✅ Email enviado! Status: {} | ID: {}",
                response.getStatusCode(),
                response.getBody() != null ? response.getBody().get("id") : "?"
            );

        } catch (Exception e) {
            log.error("❌ FALHA ao enviar email para {}: {}", to, e.getMessage());
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
                <p style="color:rgba(255,255,255,0.5);margin:4px 0 0;font-size:13px">FIGURINHAS 2026</p>
              </div>
              <div style="padding:32px">
                <h2 style="color:#ffffff;margin:0 0 16px">Olá, %s! 👋</h2>
                <p style="color:rgba(255,255,255,0.7);line-height:1.6">
                  Sua conta foi criada! Clique no botão abaixo para confirmar seu email e ativar a conta.
                </p>
                <div style="text-align:center;margin:32px 0">
                  <a href="%s" style="background:#C4A135;color:#0a0a0a;padding:14px 32px;
                                      border-radius:12px;text-decoration:none;font-weight:900;
                                      font-size:15px;letter-spacing:1px;display:inline-block">
                    ✅ CONFIRMAR EMAIL
                  </a>
                </div>
                <p style="color:rgba(255,255,255,0.3);font-size:12px;text-align:center">
                  Link válido por 24 horas. Se não foi você, ignore este email.
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
                <p style="color:rgba(255,255,255,0.5);margin:4px 0 0;font-size:13px">FIGURINHAS 2026</p>
              </div>
              <div style="padding:32px">
                <h2 style="color:#ffffff;margin:0 0 16px">Olá, %s! 🔐</h2>
                <p style="color:rgba(255,255,255,0.7);line-height:1.6">
                  Recebemos uma solicitação para redefinir sua senha.
                  Clique no botão abaixo para criar uma nova senha.
                </p>
                <div style="text-align:center;margin:32px 0">
                  <a href="%s" style="background:#C4A135;color:#0a0a0a;padding:14px 32px;
                                      border-radius:12px;text-decoration:none;font-weight:900;
                                      font-size:15px;letter-spacing:1px;display:inline-block">
                    🔐 REDEFINIR SENHA
                  </a>
                </div>
                <p style="color:rgba(255,255,255,0.3);font-size:12px;text-align:center">
                  Link válido por 1 hora. Se não foi você, ignore este email.
                </p>
              </div>
            </div>
            """.formatted(name, url);
    }
}