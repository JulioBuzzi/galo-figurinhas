package com.copa2026.service;

import com.copa2026.dto.UpdatePhoneRequest;
import com.copa2026.dto.UserProfileResponse;
import com.copa2026.model.User;
import com.copa2026.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserProfileResponse getProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        return toResponse(user);
    }

    @Transactional
    public UserProfileResponse updatePhone(Long userId, UpdatePhoneRequest req) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (req.getPhone() != null) {
            String digits = req.getPhone().replaceAll("[^0-9]", "");
            if (!digits.isEmpty() && (digits.length() < 10 || digits.length() > 11)) {
                throw new RuntimeException("Telefone inválido. Use DDD + número (10 ou 11 dígitos)");
            }
            user.setPhone(digits.isEmpty() ? null : digits);
        }
        if (req.getShowPhone() != null) {
            user.setShowPhone(req.getShowPhone());
        }
        user = userRepository.save(user);
        return toResponse(user);
    }

    private UserProfileResponse toResponse(User user) {
        UserProfileResponse r = new UserProfileResponse();
        r.setId(user.getId());
        r.setName(user.getName());
        r.setEmail(user.getEmail());
        r.setPhone(user.getPhone());
        r.setShowPhone(user.getShowPhone() != null && user.getShowPhone());
        r.setUserCode(user.getUserCode());
        return r;
    }
}