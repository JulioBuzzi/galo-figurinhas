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

@Service
@RequiredArgsConstructor
@Slf4j
public class MatchService {

    private final UserStickerRepository userStickerRepository;
    private final UserRepository        userRepository;
    private final StickerService        stickerService;

    public MatchResponse findMatchBetween(Long myUserId, Long targetUserId) {

        User target = userRepository.findById(targetUserId)
                .orElseThrow(() -> new RuntimeException(
                        "Usuário com código " + String.format("%06d", targetUserId) + " não encontrado."));

        if (myUserId.equals(targetUserId)) {
            throw new RuntimeException("Você não pode fazer match com você mesmo!");
        }

        // Carrega álbuns dos dois
        List<UserSticker> myStickers    = userStickerRepository.findByUserId(myUserId);
        List<UserSticker> theirStickers = userStickerRepository.findByUserId(targetUserId);

        // O que EU preciso (NAO_TENHO)
        Set<Long> myWantedIds = myStickers.stream()
                .filter(us -> us.getStatus() == UserSticker.Status.NAO_TENHO)
                .map(us -> us.getSticker().getId())
                .collect(Collectors.toSet());

        // O que ELES precisam (NAO_TENHO)
        Set<Long> theirWantedIds = theirStickers.stream()
                .filter(us -> us.getStatus() == UserSticker.Status.NAO_TENHO)
                .map(us -> us.getSticker().getId())
                .collect(Collectors.toSet());

        // Repetidas DELES que EU preciso
        // = stickers do outro onde repeatedCount > 0 E id está no meu NAO_TENHO
        List<StickerResponse> theyGiveMe = theirStickers.stream()
                .filter(us -> us.getRepeatedCount() > 0
                           && myWantedIds.contains(us.getSticker().getId()))
                .map(us -> stickerService.toStickerResponse(us.getSticker()))
                .collect(Collectors.toList());

        // Minhas REPETIDAS que ELES precisam
        // = meus stickers onde repeatedCount > 0 E id está no NAO_TENHO deles
        List<StickerResponse> iGiveThem = myStickers.stream()
                .filter(us -> us.getRepeatedCount() > 0
                           && theirWantedIds.contains(us.getSticker().getId()))
                .map(us -> stickerService.toStickerResponse(us.getSticker()))
                .collect(Collectors.toList());

        int score = theyGiveMe.size() + iGiveThem.size();

        MatchResponse response = new MatchResponse();
        response.setUserId(target.getId());
        response.setUserName(target.getName());
        response.setUserCode(String.format("%06d", target.getId()));
        // Só mostra telefone se o usuário optou por mostrar
        if (Boolean.TRUE.equals(target.getShowPhone()) && target.getPhone() != null) {
            response.setUserPhone(formatPhone(target.getPhone()));
        }
        response.setTheyHaveWhatINeed(theyGiveMe);
        response.setIHaveWhatTheyNeed(iGiveThem);
        response.setMatchScore(score);
        return response;
    }

    /** Formata número brasileiro: (11) 99999-9999 */
    private String formatPhone(String digits) {
        if (digits == null) return null;
        if (digits.length() == 11)
            return String.format("(%s) %s-%s",
                    digits.substring(0, 2),
                    digits.substring(2, 7),
                    digits.substring(7));
        if (digits.length() == 10)
            return String.format("(%s) %s-%s",
                    digits.substring(0, 2),
                    digits.substring(2, 6),
                    digits.substring(6));
        return digits;
    }
}