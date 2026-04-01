package com.copa2026.dto;

import lombok.Data;

public class AuthDTOs {

    @Data
    public static class RegisterRequest {
        private String name;
        private String email;
        private String password;
    }

    @Data
    public static class VerifyEmailRequest {
        private String email;
        private String code;
    }

    @Data
    public static class LoginRequest {
        private String email;
        private String password;
    }

    @Data
    public static class ForgotPasswordRequest {
        private String email;
    }

    @Data
    public static class ResetPasswordRequest {
        private String email;
        private String code;
        private String newPassword;
    }

    @Data
    public static class AuthResponse {
        private String token;
        private Long userId;
        private String name;
        private String email;

        public AuthResponse(String token, Long userId, String name, String email) {
            this.token = token; this.userId = userId;
            this.name = name;   this.email = email;
        }
    }
}