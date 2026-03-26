package com.copa2026.service;

import com.copa2026.dto.MatchResponse;
import com.copa2026.dto.StickerResponse;
import com.copa2026.model.User;
import com.copa2026.model.UserSticker;
import com.copa2026.repository.UserRepository;
import com.copa2026.repository.UserStickerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Calcula trocas possíveis entre dois usuários específicos.
 *
 * Lógica:
 *  - theyGiveMe  → repetidas DO OUTRO que EU preciso (NAO_TENHO)
 *  - iGiveThem   → minhas REPETIDAS que O OUTRO precisa (NAO_TENHO)
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class MatchService {

    private final UserStickerRepository userStickerRepository;
    private final UserRepository        userRepository;
    private final StickerService        stickerService;

    public MatchResponse findMatchBetween(Long myUserId, Long targetUserId) {

        // Valida usuário alvo
        User target = userRepository.findById(targetUserId)
                .orElseThrow(() -> new RuntimeException(
                        "Usuário com ID " + targetUserId + " não encontrado."));

        if (myUserId.equals(targetUserId)) {
            throw new RuntimeException("Você não pode fazer match com você mesmo!");
        }

        // Carrega os dados dos dois usuários
        List<UserSticker> myStickers     = userStickerRepository.findByUserId(myUserId);
        List<UserSticker> theirStickers  = userStickerRepository.findByUserId(targetUserId);

        // Meus IDs que preciso
        Set<Long> myWantedIds = myStickers.stream()
                .filter(us -> us.getStatus() == UserSticker.Status.NAO_TENHO)
                .map(us -> us.getSticker().getId())
                .collect(Collectors.toSet());

        // IDs das minhas repetidas
        Set<Long> myRepeatedIds = myStickers.stream()
                .filter(us -> us.getRepeatedCount() > 0)
                .map(us -> us.getSticker().getId())
                .collect(Collectors.toSet());

        // IDs que o outro precisa
        Set<Long> theirWantedIds = theirStickers.stream()
                .filter(us -> us.getStatus() == UserSticker.Status.NAO_TENHO)
                .map(us -> us.getSticker().getId())
                .collect(Collectors.toSet());

        // IDs das repetidas do outro
        Set<Long> theirRepeatedIds = theirStickers.stream()
                .filter(us -> us.getRepeatedCount() > 0)
                .map(us -> us.getSticker().getId())
                .collect(Collectors.toSet());

        // Repetidas DELES que EU preciso
        List<StickerResponse> theyGiveMe = theirStickers.stream()
                .filter(us -> us.getRepeatedCount() > 0
                           && myWantedIds.contains(us.getSticker().getId()))
                .map(us -> stickerService.toStickerResponse(us.getSticker()))
                .collect(Collectors.toList());

        // Minhas REPETIDAS que ELES precisam
        List<StickerResponse> iGiveThem = myStickers.stream()
                .filter(us -> us.getRepeatedCount() > 0
                           && theirWantedIds.contains(us.getSticker().getId()))
                .map(us -> stickerService.toStickerResponse(us.getSticker()))
                .collect(Collectors.toList());

        MatchResponse response = new MatchResponse();
        response.setUserId(target.getId());
        response.setUserName(target.getName());
        response.setUserEmail(target.getEmail());
        response.setTheyHaveWhatINeed(theyGiveMe);
        response.setIHaveWhatTheyNeed(iGiveThem);
        response.setMatchScore(theyGiveMe.size() + iGiveThem.size());
        return response;
    }
}