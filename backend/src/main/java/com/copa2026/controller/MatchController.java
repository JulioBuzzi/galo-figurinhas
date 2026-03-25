package com.copa2026.controller;

import com.copa2026.dto.MatchResponse;
import com.copa2026.service.MatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller do sistema de match entre colecionadores.
 */
@RestController
@RequestMapping("/api/matches")
@RequiredArgsConstructor
public class MatchController {

    private final MatchService matchService;

    /**
     * GET /api/matches
     * Retorna lista de usuários compatíveis para troca,
     * ordenados por relevância (matchScore).
     *
     * Cada item inclui:
     * - Figurinhas que o outro usuário tem e eu preciso
     * - Minhas figurinhas repetidas que ele precisa
     */
    @GetMapping
    public ResponseEntity<List<MatchResponse>> findMatches(Authentication auth) {
        Long userId = (Long) auth.getCredentials();
        return ResponseEntity.ok(matchService.findMatches(userId));
    }
}
