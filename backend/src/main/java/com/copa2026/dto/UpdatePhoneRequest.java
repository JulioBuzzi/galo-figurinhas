package com.copa2026.dto;

import lombok.Data;

@Data
public class UpdatePhoneRequest {
    private String phone;
    private Boolean showPhone;
}