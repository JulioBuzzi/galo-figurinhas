package com.copa2026.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class EmailService {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${resend.api-key}")
    private String apiKey;

    @Value("${resend.from-email}")
    private String fromEmail;

    public void sendVerificationCode(String toEmail, String userName, String code) {
        String subject = "Seu código de verificação — FroSócios Figurinhas";
        String html = buildCodeEmail(userName, code,
            "Insira o código abaixo para ativar sua conta.",
            "Válido por 15 minutos.");
        send(toEmail, subject, html);
    }

    public void sendPasswordResetCode(String toEmail, String userName, String code) {
        String subject = "Código para redefinir senha — FroSócios Figurinhas";
        String html = buildCodeEmail(userName, code,
            "Insira o código abaixo para criar uma nova senha.",
            "Válido por 15 minutos. Ignore se não foi você.");
        send(toEmail, subject, html);
    }

    private void send(String to, String subject, String html) {
        try {
            log.info("Enviando email para: {}", to);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);
            Map<String, Object> body = Map.of(
                "from",    fromEmail,
                "to",      List.of(to),
                "subject", subject,
                "html",    html
            );
            ResponseEntity<Map> response = restTemplate.postForEntity(
                "https://api.resend.com/emails",
                new HttpEntity<>(body, headers),
                Map.class
            );
            log.info("Email enviado! ID: {}",
                response.getBody() != null ? response.getBody().get("id") : "?");
        } catch (Exception e) {
            log.error("Falha ao enviar email para {}: {}", to, e.getMessage());
            throw new RuntimeException("Falha ao enviar email.");
        }
    }

    private String buildCodeEmail(String name, String code, String desc, String footer) {
        return String.format("""
            <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;
                        background:#0a0a0a;border-radius:16px;overflow:hidden">
              <div style="background:linear-gradient(135deg,#0a0a0a,#2a2a2a);padding:28px 32px;
                          text-align:center;border-bottom:3px solid #C4A135">
                <h1 style="color:#C4A135;margin:0;font-size:26px;letter-spacing:4px">FroSócios</h1>
                <p style="color:rgba(255,255,255,0.4);margin:4px 0 0;font-size:12px">FIGURINHAS 2026</p>
              </div>
              <div style="padding:32px;text-align:center">
                <h2 style="color:#ffffff;margin:0 0 8px">Olá, %s!</h2>
                <p style="color:rgba(255,255,255,0.6);font-size:14px;margin:0 0 28px">%s</p>
                <div style="background:#1a1a1a;border:2px dashed #C4A135;border-radius:16px;
                            padding:24px 16px;margin:0 0 24px">
                  <p style="color:rgba(255,255,255,0.4);font-size:12px;margin:0 0 8px;
                             letter-spacing:2px;text-transform:uppercase">Seu código</p>
                  <p style="color:#C4A135;font-size:48px;font-weight:900;letter-spacing:12px;
                             margin:0;font-family:monospace">%s</p>
                </div>
                <p style="color:rgba(255,255,255,0.25);font-size:12px;margin:0">%s</p>
              </div>
            </div>
            """, name, desc, code, footer);
    }
}