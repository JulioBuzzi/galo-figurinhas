package com.copa2026.service;

import com.copa2026.dto.AuthDTOs.*;
import com.copa2026.model.User;
import com.copa2026.repository.UserRepository;
import com.copa2026.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository  userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil         jwtUtil;
    private final SecureRandom    random = new SecureRandom();

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email já está em uso");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setShowPhone(false);
        user.setUserCode(generateUniqueCode());

        user = userRepository.save(user);
        String token = jwtUtil.generateToken(user.getEmail(), user.getId());
        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail());
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email ou senha inválidos"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Email ou senha inválidos");
        }
        String token = jwtUtil.generateToken(user.getEmail(), user.getId());
        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail());
    }

    /** Gera código de 6 dígitos único (100000–999999) */
    private String generateUniqueCode() {
        String code;
        int attempts = 0;
        do {
            int num = 100000 + random.nextInt(900000);
            code = String.valueOf(num);
            attempts++;
            if (attempts > 100) throw new RuntimeException("Não foi possível gerar código único");
        } while (userRepository.existsByUserCode(code));
        return code;
    }
}