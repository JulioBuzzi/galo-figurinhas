package com.copa2026.controller;

import com.copa2026.dto.UpdatePhoneRequest;
import com.copa2026.dto.UserProfileResponse;
import com.copa2026.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /** GET /api/users/me — retorna perfil com código de 6 dígitos */
    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getProfile(Authentication auth) {
        Long userId = (Long) auth.getCredentials();
        return ResponseEntity.ok(userService.getProfile(userId));
    }

    /** PATCH /api/users/me/phone — atualiza telefone e visibilidade */
    @PatchMapping("/me/phone")
    public ResponseEntity<UserProfileResponse> updatePhone(
            @RequestBody UpdatePhoneRequest req,
            Authentication auth) {
        Long userId = (Long) auth.getCredentials();
        return ResponseEntity.ok(userService.updatePhone(userId, req));
    }
}