package com.copa2026.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class UserStickerResponse {
    private Long stickerId;
    private String code;
    private String name;
    private String team;
    private Integer albumNumber;
    private boolean owned;
    private Integer repeatedCount;
    private LocalDateTime updatedAt;
}