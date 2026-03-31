package com.copa2026.service;

import com.copa2026.dto.AuthDTOs.*;
import com.copa2026.model.PasswordResetToken;
import com.copa2026.model.User;
import com.copa2026.repository.PasswordResetTokenRepository;
import com.copa2026.repository.UserRepository;
import com.copa2026.security.JwtUtil;
import lombok.RequiredArgsConstructor;
<<<<<<< HEAD
=======
import lombok.extern.slf4j.Slf4j;
>>>>>>> 20b2388ecb0775f0530872c0c9e0a3967706be07
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;

@Service
@RequiredArgsConstructor
<<<<<<< HEAD
public class AuthService {

    private final UserRepository              userRepository;
    private final PasswordResetTokenRepository resetTokenRepo;
    private final PasswordEncoder             passwordEncoder;
    private final JwtUtil                     jwtUtil;
    private final EmailService                emailService;
    private final SecureRandom                random = new SecureRandom();

    /** Cadastro: cria conta e envia email de verificação */
=======
@Slf4j
public class AuthService {

    private final UserRepository               userRepository;
    private final PasswordResetTokenRepository resetTokenRepo;
    private final PasswordEncoder              passwordEncoder;
    private final JwtUtil                      jwtUtil;
    private final EmailService                 emailService;
    private final SecureRandom                 random = new SecureRandom();

>>>>>>> 20b2388ecb0775f0530872c0c9e0a3967706be07
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
<<<<<<< HEAD

        userRepository.save(user);

        // Envia email de verificação (assíncrono)
        emailService.sendVerificationEmail(user.getEmail(), user.getName(), verificationToken);
=======
        userRepository.save(user);

        try {
            emailService.sendVerificationEmail(user.getEmail(), user.getName(), verificationToken);
        } catch (Exception e) {
            log.error("Falha ao enviar email de verificação: {}", e.getMessage());
            // Conta criada mesmo sem email — permite reenvio futuro
        }
>>>>>>> 20b2388ecb0775f0530872c0c9e0a3967706be07

        return "Conta criada! Verifique seu email para ativar a conta.";
    }

<<<<<<< HEAD
    /** Verifica o token de email e ativa a conta */
=======
>>>>>>> 20b2388ecb0775f0530872c0c9e0a3967706be07
    @Transactional
    public AuthResponse verifyEmail(String token) {
        User user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> new RuntimeException("Token inválido ou já utilizado"));

        if (Boolean.TRUE.equals(user.getEmailVerified())) {
<<<<<<< HEAD
            throw new RuntimeException("Email já foi verificado");
=======
            throw new RuntimeException("Email já foi verificado. Faça login.");
>>>>>>> 20b2388ecb0775f0530872c0c9e0a3967706be07
        }

        user.setEmailVerified(true);
        user.setVerificationToken(null);
        user = userRepository.save(user);

        String jwt = jwtUtil.generateToken(user.getEmail(), user.getId());
        return new AuthResponse(jwt, user.getId(), user.getName(), user.getEmail());
    }

<<<<<<< HEAD
    /** Login — só permite se email verificado */
=======
>>>>>>> 20b2388ecb0775f0530872c0c9e0a3967706be07
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

<<<<<<< HEAD
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
=======
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

>>>>>>> 20b2388ecb0775f0530872c0c9e0a3967706be07
        resetTokenRepo.deleteByUserId(user.getId());

        String token = generateToken();
        PasswordResetToken prt = new PasswordResetToken();
        prt.setUser(user);
        prt.setToken(token);
        prt.setExpiresAt(LocalDateTime.now().plusHours(1));
        prt.setUsed(false);
        resetTokenRepo.save(prt);

<<<<<<< HEAD
        emailService.sendPasswordResetEmail(user.getEmail(), user.getName(), token);
    }

    /** Redefine a senha usando o token */
=======
        try {
            emailService.sendPasswordResetEmail(user.getEmail(), user.getName(), token);
        } catch (Exception e) {
            log.error("Falha ao enviar email de reset para {}: {}", user.getEmail(), e.getMessage());
            // Não expõe o erro ao usuário — retorna sucesso mesmo assim
        }
    }

>>>>>>> 20b2388ecb0775f0530872c0c9e0a3967706be07
    @Transactional
    public void resetPassword(String token, String newPassword) {
        PasswordResetToken prt = resetTokenRepo.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Token inválido ou expirado"));

<<<<<<< HEAD
        if (prt.isExpired()) throw new RuntimeException("Token expirado. Solicite um novo.");
=======
        if (prt.isExpired()) throw new RuntimeException("Token expirado. Solicite um novo link.");
>>>>>>> 20b2388ecb0775f0530872c0c9e0a3967706be07
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
<<<<<<< HEAD
            if (++attempts > 100) throw new RuntimeException("Não foi possível gerar código único");
        } while (userRepository.existsByUserCode(code));
        return code;
    }
}
=======
            if (++attempts > 100) throw new RuntimeException("Erro ao gerar código");
        } while (userRepository.existsByUserCode(code));
        return code;
    }
}
>>>>>>> 20b2388ecb0775f0530872c0c9e0a3967706be07
