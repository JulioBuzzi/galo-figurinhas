package com.copa2026.dto;

import com.copa2026.model.UserSticker;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateStickerStatusRequest {
    @NotNull(message = "Status é obrigatório")
    private UserSticker.Status status;
}
