package com.copa2026.controller;

import com.copa2026.dto.MatchResponse;
import com.copa2026.service.MatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/matches")
@RequiredArgsConstructor
public class MatchController {

    private final MatchService matchService;

    /**
     * GET /api/matches/search?targetCode=000001
     * Busca por código de 6 dígitos (= ID com zeros à esquerda)
     */
    @GetMapping("/search")
    public ResponseEntity<MatchResponse> searchMatch(
            @RequestParam String targetCode,
            Authentication auth) {
        Long userId = (Long) auth.getCredentials();
        // Converte código de 6 dígitos para Long (remove zeros)
        Long targetId;
        try {
            targetId = Long.parseLong(targetCode.trim());
        } catch (NumberFormatException e) {
            throw new RuntimeException("Código inválido. Use o código de 6 dígitos do colecionador.");
        }
        return ResponseEntity.ok(matchService.findMatchBetween(userId, targetId));
    }
}
