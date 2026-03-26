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
     * GET /api/matches/search?targetUserId=X
     * Calcula trocas possíveis entre o usuário logado e o usuário alvo (por ID).
     */
    @GetMapping("/search")
    public ResponseEntity<MatchResponse> searchMatch(
            @RequestParam Long targetUserId,
            Authentication auth) {
        Long userId = (Long) auth.getCredentials();
        return ResponseEntity.ok(matchService.findMatchBetween(userId, targetUserId));
    }
}