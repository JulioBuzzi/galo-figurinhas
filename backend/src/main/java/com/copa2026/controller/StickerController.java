package com.copa2026.controller;

import com.copa2026.dto.*;
import com.copa2026.model.UserSticker;
import com.copa2026.service.StickerService;
import jakarta.validation.Valid;
import lombok.Data;
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

    /** GET /api/stickers — lista todas (público) */
    @GetMapping("/stickers")
    public ResponseEntity<List<StickerResponse>> getAllStickers() {
        return ResponseEntity.ok(stickerService.getAllStickers());
    }

    /** GET /api/album — álbum completo com status */
    @GetMapping("/album")
    public ResponseEntity<List<UserStickerResponse>> getMyAlbum(Authentication auth) {
        Long userId = (Long) auth.getCredentials();
        return ResponseEntity.ok(stickerService.getUserAlbum(userId));
    }

    /** GET /api/album/owned — só figurinhas que TENHO (para página repetidas) */
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

    /** PUT /api/album/stickers/{id} — marca TENHO ou NAO_TENHO */
    @PutMapping("/album/stickers/{stickerId}")
    public ResponseEntity<UserStickerResponse> updateStatus(
            @PathVariable Long stickerId,
            @Valid @RequestBody UpdateStickerStatusRequest request,
            Authentication auth) {
        Long userId = (Long) auth.getCredentials();
        return ResponseEntity.ok(
            stickerService.updateStickerStatus(userId, stickerId, request.getStatus())
        );
    }

    /** PATCH /api/album/stickers/{id}/repeated?delta=1 ou delta=-1 */
    @PatchMapping("/album/stickers/{stickerId}/repeated")
    public ResponseEntity<UserStickerResponse> updateRepeated(
            @PathVariable Long stickerId,
            @RequestParam(defaultValue = "1") int delta,
            Authentication auth) {
        Long userId = (Long) auth.getCredentials();
        return ResponseEntity.ok(
            stickerService.updateRepeatedCount(userId, stickerId, delta)
        );
    }
}
