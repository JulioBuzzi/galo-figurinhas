package com.copa2026.dto;

import lombok.Data;

@Data
public class StickerResponse {
    private Long id;
    private String code;
    private String name;
    private String team;
    private Integer albumNumber;
}
