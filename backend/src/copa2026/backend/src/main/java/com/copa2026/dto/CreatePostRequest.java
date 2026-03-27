package com.copa2026.dto;

import lombok.Data;
import java.util.ArrayList;
import java.util.List;

@Data
public class CreatePostRequest {
    private String text;
    private List<Long> wantedStickerIds = new ArrayList<>();
    private List<Long> offeredStickerIds = new ArrayList<>();
}
