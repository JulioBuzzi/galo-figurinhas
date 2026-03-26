package com.copa2026.dto;

import lombok.Data;

@Data
public class UserProfileResponse {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private Boolean showPhone;
    /** Código de 6 dígitos gerado a partir do ID */
    private String userCode;
}