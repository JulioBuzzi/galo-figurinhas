package com.copa2026.service;

import com.copa2026.dto.AuthDTOs.*;
import com.copa2026.model.User;
import com.copa2026.repository.UserRepository;
import com.copa2026.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Serviço de autenticação: registro e login de usuários.
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    /**
     * Registra um novo usuário.
     * Valida se o email já está em uso e salva com senha criptografada.
     */
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email já está em uso");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        user = userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail(), user.getId());
        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail());
    }

    /**
     * Realiza login verificando email e senha.
     * Retorna token JWT em caso de sucesso.
     */
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email ou senha inválidos"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Email ou senha inválidos");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getId());
        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail());
    }
}
