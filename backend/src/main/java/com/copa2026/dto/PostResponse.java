package com.copa2026.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class PostResponse {
    private Long id;
    private Long userId;
    private String userName;
    private String text;
    private List<StickerResponse> wantedStickers;
    private List<StickerResponse> offeredStickers;
    private LocalDateTime createdAt;
}
