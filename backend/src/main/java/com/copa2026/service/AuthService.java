package com.copa2026.service;

import com.copa2026.dto.AuthDTOs.*;
import com.copa2026.model.PasswordResetToken;
import com.copa2026.model.User;
import com.copa2026.repository.PasswordResetTokenRepository;
import com.copa2026.repository.UserRepository;
import com.copa2026.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository              userRepository;
    private final PasswordResetTokenRepository resetTokenRepo;
    private final PasswordEncoder             passwordEncoder;
    private final JwtUtil                     jwtUtil;
    private final EmailService                emailService;
    private final SecureRandom                random = new SecureRandom();

    /** Cadastro: cria conta e envia email de verificação */
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

        // Envia email de verificação (assíncrono)
        emailService.sendVerificationEmail(user.getEmail(), user.getName(), verificationToken);

        return "Conta criada! Verifique seu email para ativar a conta.";
    }

    /** Verifica o token de email e ativa a conta */
    @Transactional
    public AuthResponse verifyEmail(String token) {
        User user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> new RuntimeException("Token inválido ou já utilizado"));

        if (Boolean.TRUE.equals(user.getEmailVerified())) {
            throw new RuntimeException("Email já foi verificado");
        }

        user.setEmailVerified(true);
        user.setVerificationToken(null);
        user = userRepository.save(user);

        String jwt = jwtUtil.generateToken(user.getEmail(), user.getId());
        return new AuthResponse(jwt, user.getId(), user.getName(), user.getEmail());
    }

    /** Login — só permite se email verificado */
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

        String token = jwtUtil.generateToken(user.getEmail(), user.getId());
        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail());
    }

    /** Solicita reset de senha — envia email com link */
    @Transactional
    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email).orElse(null);
        // Não revela se o email existe ou não (segurança)
        if (user == null) return;

        // Remove tokens anteriores
        resetTokenRepo.deleteByUserId(user.getId());

        String token = generateToken();
        PasswordResetToken prt = new PasswordResetToken();
        prt.setUser(user);
        prt.setToken(token);
        prt.setExpiresAt(LocalDateTime.now().plusHours(1));
        prt.setUsed(false);
        resetTokenRepo.save(prt);

        emailService.sendPasswordResetEmail(user.getEmail(), user.getName(), token);
    }

    /** Redefine a senha usando o token */
    @Transactional
    public void resetPassword(String token, String newPassword) {
        PasswordResetToken prt = resetTokenRepo.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Token inválido ou expirado"));

        if (prt.isExpired()) throw new RuntimeException("Token expirado. Solicite um novo.");
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
            if (++attempts > 100) throw new RuntimeException("Não foi possível gerar código único");
        } while (userRepository.existsByUserCode(code));
        return code;
    }
}
