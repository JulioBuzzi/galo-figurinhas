package com.copa2026.service;

import com.copa2026.dto.MatchResponse;
import com.copa2026.dto.StickerResponse;
import com.copa2026.model.User;
import com.copa2026.model.UserSticker;
import com.copa2026.repository.StickerRepository;
import com.copa2026.repository.UserRepository;
import com.copa2026.repository.UserStickerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Serviço de Match com algoritmo adaptativo.
 *
 * Threshold mínimo de trocas baseado no progresso do álbum:
 *   0–30%   → mínimo 10 trocas em comum
 *   30–60%  → mínimo 5
 *   60–80%  → mínimo 3
 *   80–95%  → mínimo 2
 *   95–100% → mínimo 1
 *
 * Limita a 20 matches retornados, ordenados por score.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class MatchService {

    private static final int MAX_RESULTS = 20;

    private final UserStickerRepository userStickerRepository;
    private final UserRepository        userRepository;
    private final StickerRepository     stickerRepository;
    private final StickerService        stickerService;

    public List<MatchResponse> findMatches(Long userId) {

        // 1. Total de figurinhas no álbum
        long totalStickers = stickerRepository.count();
        if (totalStickers == 0) return Collections.emptyList();

        // 2. Meu progresso
        long myOwned = userStickerRepository.countByUserIdAndStatus(userId, UserSticker.Status.TENHO);
        double completionPct = (double) myOwned / totalStickers * 100;

        // 3. Threshold adaptativo
        int minThreshold = calcThreshold(completionPct);
        log.info("Match para user={} | progresso={:.1f}% | threshold={}", userId, completionPct, minThreshold);

        // 4. Minhas figurinhas que preciso (NAO_TENHO)
        Set<Long> myWantedIds = userStickerRepository
                .findByUserIdAndStatus(userId, UserSticker.Status.NAO_TENHO)
                .stream()
                .map(us -> us.getSticker().getId())
                .collect(Collectors.toSet());

        // 5. Minhas repetidas
        Map<Long, UserSticker> myRepeatedMap = userStickerRepository
                .findByUserId(userId)
                .stream()
                .filter(us -> us.getRepeatedCount() > 0)
                .collect(Collectors.toMap(us -> us.getSticker().getId(), us -> us));

        Set<Long> myRepeatedIds = myRepeatedMap.keySet();

        // Sem nada no álbum → sem matches
        if (myWantedIds.isEmpty() && myRepeatedIds.isEmpty()) return Collections.emptyList();

        // 6. Candidatos: usuários que têm interseção com minhas necessidades ou repetidas
        List<Long> candidateIds = new ArrayList<>();
        if (!myWantedIds.isEmpty())   candidateIds.addAll(userStickerRepository.findUsersWhoHaveMyWanted(userId));
        if (!myRepeatedIds.isEmpty()) candidateIds.addAll(userStickerRepository.findUsersWhoNeedMyRepeated(userId));

        Set<Long> uniqueCandidates = new HashSet<>(candidateIds);
        uniqueCandidates.remove(userId);

        if (uniqueCandidates.isEmpty()) return Collections.emptyList();

        // 7. Calcula score de cada candidato
        List<MatchResponse> matches = new ArrayList<>();

        for (Long candidateId : uniqueCandidates) {
            User candidate = userRepository.findById(candidateId).orElse(null);
            if (candidate == null) continue;

            List<UserSticker> theirStickers = userStickerRepository.findByUserId(candidateId);

            // Figurinhas REPETIDAS deles que eu preciso
            List<StickerResponse> theyGiveMe = theirStickers.stream()
                    .filter(us -> us.getRepeatedCount() > 0
                               && myWantedIds.contains(us.getSticker().getId()))
                    .map(us -> stickerService.toStickerResponse(us.getSticker()))
                    .collect(Collectors.toList());

            // Minhas REPETIDAS que eles precisam (NAO_TENHO)
            Set<Long> theirWantedIds = theirStickers.stream()
                    .filter(us -> us.getStatus() == UserSticker.Status.NAO_TENHO)
                    .map(us -> us.getSticker().getId())
                    .collect(Collectors.toSet());

            List<StickerResponse> iGiveThem = myRepeatedMap.entrySet().stream()
                    .filter(e -> theirWantedIds.contains(e.getKey()))
                    .map(e -> stickerService.toStickerResponse(e.getValue().getSticker()))
                    .collect(Collectors.toList());

            int score = theyGiveMe.size() + iGiveThem.size();

            // Aplica threshold adaptativo
            if (score < minThreshold) continue;

            MatchResponse m = new MatchResponse();
            m.setUserId(candidate.getId());
            m.setUserName(candidate.getName());
            m.setUserEmail(candidate.getEmail());
            m.setTheyHaveWhatINeed(theyGiveMe);
            m.setIHaveWhatTheyNeed(iGiveThem);
            m.setMatchScore(score);
            matches.add(m);
        }

        // 8. Ordena por score e limita a MAX_RESULTS
        return matches.stream()
                .sorted(Comparator.comparingInt(MatchResponse::getMatchScore).reversed())
                .limit(MAX_RESULTS)
                .collect(Collectors.toList());
    }

    /**
     * Threshold mínimo de trocas baseado no % do álbum completo.
     * Quanto mais completo, menos exigente — já que há poucas figurinhas faltando.
     */
    private int calcThreshold(double completionPct) {
        if (completionPct >= 95) return 1;
        if (completionPct >= 80) return 2;
        if (completionPct >= 60) return 3;
        if (completionPct >= 30) return 5;
        return 10;
    }
}