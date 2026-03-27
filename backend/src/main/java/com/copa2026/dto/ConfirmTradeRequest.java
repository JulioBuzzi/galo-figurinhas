package com.copa2026.dto;

import lombok.Data;
import java.util.ArrayList;
import java.util.List;

/**
 * Registra uma troca concluída entre dois usuários.
 *
 * receivedStickerIds → stickers que EU recebi do outro (adiciona ao meu álbum se não tiver)
 * givenStickerIds    → stickers que EU dei (diminui minha repeatedCount)
 */
@Data
public class ConfirmTradeRequest {
    private Long targetUserId;
    private List<Long> receivedStickerIds = new ArrayList<>();
    private List<Long> givenStickerIds    = new ArrayList<>();
}