package com.copa2026.controller;

import com.copa2026.dto.ConfirmTradeRequest;
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

    /** GET /api/matches/search?targetCode=000001 */
    @GetMapping("/search")
    public ResponseEntity<MatchResponse> search(
            @RequestParam String targetCode,
            Authentication auth) {
        Long userId = (Long) auth.getCredentials();
        Long targetId;
        try {
            targetId = Long.parseLong(targetCode.trim());
        } catch (NumberFormatException e) {
            throw new RuntimeException("Código inválido.");
        }
        return ResponseEntity.ok(matchService.findMatchBetween(userId, targetId));
    }

    /** POST /api/matches/confirm-trade — registra troca concluída */
    @PostMapping("/confirm-trade")
    public ResponseEntity<Void> confirmTrade(
            @RequestBody ConfirmTradeRequest req,
            Authentication auth) {
        Long userId = (Long) auth.getCredentials();
        matchService.confirmTrade(userId, req);
        return ResponseEntity.ok().build();
    }
}