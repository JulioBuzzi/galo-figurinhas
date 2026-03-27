package com.copa2026.service;

import com.copa2026.dto.MatchResponse;
import com.copa2026.dto.StickerResponse;
import com.copa2026.model.User;
import com.copa2026.repository.StickerRepository;
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
    private final StickerRepository     stickerRepository;
    private final StickerService        stickerService;

    public MatchResponse findMatchBetween(Long myUserId, Long targetUserId) {

        User target = userRepository.findById(targetUserId)
                .orElseThrow(() -> new RuntimeException(
                        "Nenhum colecionador encontrado com o código "
                        + String.format("%06d", targetUserId)));

        if (myUserId.equals(targetUserId)) {
            throw new RuntimeException("Você não pode fazer match com você mesmo!");
        }

        Set<Long> myOwnedIds      = userStickerRepository.findStickerIdsByUserId(myUserId);
        Set<Long> myRepeatedIds   = userStickerRepository.findRepeatedStickerIdsByUserId(myUserId);
        Set<Long> theirOwnedIds   = userStickerRepository.findStickerIdsByUserId(targetUserId);
        Set<Long> theirRepeatedIds= userStickerRepository.findRepeatedStickerIdsByUserId(targetUserId);

        // Repetidas deles que EU não tenho
        Set<Long> theyGiveMeIds = new HashSet<>(theirRepeatedIds);
        theyGiveMeIds.removeAll(myOwnedIds);

        // Minhas repetidas que ELES não têm
        Set<Long> iGiveThemIds = new HashSet<>(myRepeatedIds);
        iGiveThemIds.removeAll(theirOwnedIds);

        List<StickerResponse> theyGiveMe = resolveStickers(theyGiveMeIds);
        List<StickerResponse> iGiveThem  = resolveStickers(iGiveThemIds);
        int score = theyGiveMe.size() + iGiveThem.size();

        MatchResponse response = new MatchResponse();
        response.setUserId(target.getId());
        response.setUserName(target.getName());
        response.setUserCode(String.format("%06d", target.getId()));
        if (Boolean.TRUE.equals(target.getShowPhone()) && target.getPhone() != null) {
            response.setUserPhone(formatPhone(target.getPhone()));
        }
        response.setTheyHaveWhatINeed(theyGiveMe);
        response.setIHaveWhatTheyNeed(iGiveThem);
        response.setMatchScore(score);

        log.info("Match {} x {}: theyGiveMe={} iGiveThem={} score={}",
                myUserId, targetUserId, theyGiveMe.size(), iGiveThem.size(), score);

        return response;
    }

    private List<StickerResponse> resolveStickers(Set<Long> ids) {
        if (ids.isEmpty()) return Collections.emptyList();
        return stickerRepository.findAllById(ids).stream()
                .map(stickerService::toStickerResponse)
                .sorted(Comparator.comparing(StickerResponse::getAlbumNumber,
                        Comparator.nullsLast(Comparator.naturalOrder())))
                .collect(Collectors.toList());
    }

    private String formatPhone(String digits) {
        if (digits == null) return null;
        if (digits.length() == 11)
            return String.format("(%s) %s-%s",
                    digits.substring(0,2), digits.substring(2,7), digits.substring(7));
        if (digits.length() == 10)
            return String.format("(%s) %s-%s",
                    digits.substring(0,2), digits.substring(2,6), digits.substring(6));
        return digits;
    }
}
