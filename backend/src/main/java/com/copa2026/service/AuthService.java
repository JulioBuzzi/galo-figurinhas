package com.copa2026.service;

import com.copa2026.dto.AuthDTOs.*;
import com.copa2026.model.PasswordResetToken;
import com.copa2026.model.User;
import com.copa2026.repository.PasswordResetTokenRepository;
import com.copa2026.repository.UserRepository;
import com.copa2026.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository               userRepository;
    private final PasswordResetTokenRepository resetTokenRepo;
    private final PasswordEncoder              passwordEncoder;
    private final JwtUtil                      jwtUtil;
    private final EmailService                 emailService;
    private final SecureRandom                 random = new SecureRandom();

    @Transactional
    public String register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Este email já está em uso");
        }

        String verificationToken = generateToken();

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setShowPhone(false);
        user.setEmailVerified(false);
        user.setVerificationToken(verificationToken);
        user.setUserCode(generateUniqueCode());
        userRepository.save(user);

        try {
            emailService.sendVerificationEmail(user.getEmail(), user.getName(), verificationToken);
        } catch (Exception e) {
            log.error("Falha ao enviar email de verificação: {}", e.getMessage());
            // Conta criada mesmo sem email — permite reenvio futuro
        }

        return "Conta criada! Verifique seu email para ativar a conta.";
    }

    @Transactional
    public AuthResponse verifyEmail(String token) {
        User user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> new RuntimeException("Token inválido ou já utilizado"));

        if (Boolean.TRUE.equals(user.getEmailVerified())) {
            throw new RuntimeException("Email já foi verificado. Faça login.");
        }

        user.setEmailVerified(true);
        user.setVerificationToken(null);
        user = userRepository.save(user);

        String jwt = jwtUtil.generateToken(user.getEmail(), user.getId());
        return new AuthResponse(jwt, user.getId(), user.getName(), user.getEmail());
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email ou senha inválidos"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Email ou senha inválidos");
        }

        if (!Boolean.TRUE.equals(user.getEmailVerified())) {
            throw new RuntimeException(
                "Email não verificado. Verifique sua caixa de entrada e clique no link de confirmação.");
        }

        String jwt = jwtUtil.generateToken(user.getEmail(), user.getId());
        return new AuthResponse(jwt, user.getId(), user.getName(), user.getEmail());
    }

    @Transactional
    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            log.info("forgotPassword: email não encontrado — {}", email);
            return; // Não revela se existe
        }

        resetTokenRepo.deleteByUserId(user.getId());

        String token = generateToken();
        PasswordResetToken prt = new PasswordResetToken();
        prt.setUser(user);
        prt.setToken(token);
        prt.setExpiresAt(LocalDateTime.now().plusHours(1));
        prt.setUsed(false);
        resetTokenRepo.save(prt);

        try {
            emailService.sendPasswordResetEmail(user.getEmail(), user.getName(), token);
        } catch (Exception e) {
            log.error("Falha ao enviar email de reset: {}", e.getMessage());
            throw new RuntimeException("Não foi possível enviar o email. Tente novamente em instantes.");
        }
    }

    @Transactional
    public void resetPassword(String token, String newPassword) {
        PasswordResetToken prt = resetTokenRepo.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Token inválido ou expirado"));

        if (prt.isExpired()) throw new RuntimeException("Token expirado. Solicite um novo link.");
        if (prt.getUsed())   throw new RuntimeException("Token já foi utilizado.");

        User user = prt.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        prt.setUsed(true);
        resetTokenRepo.save(prt);
    }

    private String generateToken() {
        byte[] bytes = new byte[32];
        random.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private String generateUniqueCode() {
        String code;
        int attempts = 0;
        do {
            code = String.valueOf(100000 + random.nextInt(900000));
            if (++attempts > 100) throw new RuntimeException("Erro ao gerar código");
        } while (userRepository.existsByUserCode(code));
        return code;
    }
}