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

    /** Passo 1 do cadastro: cria conta inativa e envia código */
    @Transactional
    public void register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Este email já está em uso");
        }

        String code = generateCode();

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setShowPhone(false);
        user.setEmailVerified(false);
        user.setVerificationCode(code);
        user.setVerificationCodeExpiresAt(LocalDateTime.now().plusMinutes(15));
        user.setUserCode(generateUniqueUserCode());
        userRepository.save(user);

        emailService.sendVerificationCode(user.getEmail(), user.getName(), code);
    }

    /** Passo 2 do cadastro: valida código e ativa conta */
    @Transactional
    public AuthResponse verifyEmail(VerifyEmailRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email não encontrado"));

        if (Boolean.TRUE.equals(user.getEmailVerified())) {
            // Já verificado — retorna JWT diretamente
            String jwt = jwtUtil.generateToken(user.getEmail(), user.getId());
            return new AuthResponse(jwt, user.getId(), user.getName(), user.getEmail());
        }

        if (user.getVerificationCode() == null) {
            throw new RuntimeException("Nenhum código pendente. Solicite um novo.");
        }
        if (LocalDateTime.now().isAfter(user.getVerificationCodeExpiresAt())) {
            throw new RuntimeException("Código expirado. Solicite um novo.");
        }
        if (!user.getVerificationCode().equals(request.getCode())) {
            throw new RuntimeException("Código incorreto. Tente novamente.");
        }

        user.setEmailVerified(true);
        user.setVerificationCode(null);
        user.setVerificationCodeExpiresAt(null);
        user = userRepository.save(user);

        String jwt = jwtUtil.generateToken(user.getEmail(), user.getId());
        return new AuthResponse(jwt, user.getId(), user.getName(), user.getEmail());
    }

    /** Reenvio de código de verificação */
    @Transactional
    public void resendVerificationCode(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email não encontrado"));

        if (Boolean.TRUE.equals(user.getEmailVerified())) {
            throw new RuntimeException("Email já verificado.");
        }

        String code = generateCode();
        user.setVerificationCode(code);
        user.setVerificationCodeExpiresAt(LocalDateTime.now().plusMinutes(15));
        userRepository.save(user);

        emailService.sendVerificationCode(user.getEmail(), user.getName(), code);
    }

    /** Login — só permite se email verificado */
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email ou senha inválidos"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Email ou senha inválidos");
        }

        if (!Boolean.TRUE.equals(user.getEmailVerified())) {
            throw new RuntimeException("EMAIL_NOT_VERIFIED");
        }

        String jwt = jwtUtil.generateToken(user.getEmail(), user.getId());
        return new AuthResponse(jwt, user.getId(), user.getName(), user.getEmail());
    }

    /** Passo 1 do reset: envia código para o email */
    @Transactional
    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) return; // Não revela se email existe

        resetTokenRepo.deleteByUserId(user.getId());

        String code = generateCode();
        PasswordResetToken prt = new PasswordResetToken();
        prt.setUser(user);
        prt.setToken(code);
        prt.setExpiresAt(LocalDateTime.now().plusMinutes(15));
        prt.setUsed(false);
        resetTokenRepo.save(prt);

        emailService.sendPasswordResetCode(user.getEmail(), user.getName(), code);
    }

    /** Passo 2 do reset: valida código e redefine senha */
    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email não encontrado"));

        PasswordResetToken prt = resetTokenRepo
                .findLatestByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Nenhum código de reset encontrado"));

        if (prt.getUsed())    throw new RuntimeException("Código já foi utilizado.");
        if (prt.isExpired())  throw new RuntimeException("Código expirado. Solicite um novo.");
        if (!prt.getToken().equals(request.getCode())) {
            throw new RuntimeException("Código incorreto. Tente novamente.");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        prt.setUsed(true);
        resetTokenRepo.save(prt);
    }

    private String generateCode() {
        return String.format("%06d", 100000 + random.nextInt(900000));
    }

    private String generateUniqueUserCode() {
        String code;
        int attempts = 0;
        do {
            code = String.valueOf(100000 + random.nextInt(900000));
            if (++attempts > 100) throw new RuntimeException("Erro ao gerar código");
        } while (userRepository.existsByUserCode(code));
        return code;
    }
}