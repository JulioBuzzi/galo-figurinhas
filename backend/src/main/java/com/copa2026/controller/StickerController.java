package com.copa2026.controller;

import com.copa2026.dto.*;
import com.copa2026.service.StickerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class StickerController {

    private final StickerService stickerService;

    /** GET /api/stickers */
    @GetMapping("/stickers")
    public ResponseEntity<List<StickerResponse>> getAllStickers() {
        return ResponseEntity.ok(stickerService.getAllStickers());
    }

    /** GET /api/album */
    @GetMapping("/album")
    public ResponseEntity<List<UserStickerResponse>> getMyAlbum(Authentication auth) {
        Long userId = (Long) auth.getCredentials();
        return ResponseEntity.ok(stickerService.getUserAlbum(userId));
    }

    /** GET /api/album/owned — só as que tenho (para repetidas) */
    @GetMapping("/album/owned")
    public ResponseEntity<List<UserStickerResponse>> getOwned(Authentication auth) {
        Long userId = (Long) auth.getCredentials();
        return ResponseEntity.ok(stickerService.getUserOwnedStickers(userId));
    }

    /** GET /api/album/progress */
    @GetMapping("/album/progress")
    public ResponseEntity<AlbumProgressResponse> getProgress(Authentication auth) {
        Long userId = (Long) auth.getCredentials();
        return ResponseEntity.ok(stickerService.getAlbumProgress(userId));
    }

    /**
     * POST /api/album/stickers/{id}/toggle
     * Alterna entre TENHO (cria registro) e NAO_TENHO (deleta registro).
     */
    @PostMapping("/album/stickers/{stickerId}/toggle")
    public ResponseEntity<UserStickerResponse> toggle(
            @PathVariable Long stickerId,
            Authentication auth) {
        Long userId = (Long) auth.getCredentials();
        return ResponseEntity.ok(stickerService.toggleOwned(userId, stickerId));
    }

    /**
     * PATCH /api/album/stickers/{id}/repeated?delta=1
     * Adiciona ou remove uma repetida.
     */
    @PatchMapping("/album/stickers/{stickerId}/repeated")
    public ResponseEntity<UserStickerResponse> updateRepeated(
            @PathVariable Long stickerId,
            @RequestParam(defaultValue = "1") int delta,
            Authentication auth) {
        Long userId = (Long) auth.getCredentials();
        return ResponseEntity.ok(stickerService.updateRepeatedCount(userId, stickerId, delta));
    }
}
