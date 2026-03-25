package com.copa2026.dto;

import com.copa2026.model.UserSticker;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class UserStickerResponse {
    private Long stickerId;
    private String code;
    private String name;
    private String team;
    private Integer albumNumber;
    private UserSticker.Status status;
    private Integer repeatedCount;
    private LocalDateTime updatedAt;
}
