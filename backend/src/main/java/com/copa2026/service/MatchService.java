package com.copa2026.service;

import com.copa2026.dto.MatchResponse;
import com.copa2026.dto.StickerResponse;
import com.copa2026.model.User;
import com.copa2026.model.UserSticker;
import com.copa2026.repository.UserRepository;
import com.copa2026.repository.UserStickerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MatchService {

    private final UserStickerRepository userStickerRepository;
    private final UserRepository userRepository;
    private final StickerService stickerService;

    public List<MatchResponse> findMatches(Long userId) {
        List<Long> usersWithMyWanted  = userStickerRepository.findUsersWhoHaveMyWanted(userId);
        List<Long> usersWhoNeedMine   = userStickerRepository.findUsersWhoNeedMyRepeated(userId);

        Set<Long> allIds = new HashSet<>();
        allIds.addAll(usersWithMyWanted);
        allIds.addAll(usersWhoNeedMine);
        if (allIds.isEmpty()) return Collections.emptyList();

        // Meus NAO_TENHO e minhas repetidas
        Set<Long> myWantedIds = userStickerRepository
                .findByUserIdAndStatus(userId, UserSticker.Status.NAO_TENHO)
                .stream().map(us -> us.getSticker().getId()).collect(Collectors.toSet());

        List<UserSticker> myRepeated = userStickerRepository.findByUserId(userId)
                .stream().filter(us -> us.getRepeatedCount() > 0).collect(Collectors.toList());

        Set<Long> myRepeatedIds = myRepeated.stream()
                .map(us -> us.getSticker().getId()).collect(Collectors.toSet());

        List<MatchResponse> matches = new ArrayList<>();

        for (Long matchUserId : allIds) {
            User matchUser = userRepository.findById(matchUserId).orElse(null);
            if (matchUser == null) continue;

            List<UserSticker> theirStickers = userStickerRepository.findByUserId(matchUserId);

            // Eles TÊM o que eu preciso
            List<StickerResponse> theyHave = theirStickers.stream()
                    .filter(us -> us.getStatus() == UserSticker.Status.TENHO
                            && myWantedIds.contains(us.getSticker().getId()))
                    .map(us -> stickerService.toStickerResponse(us.getSticker()))
                    .collect(Collectors.toList());

            // Eles PRECISAM do que eu tenho repetido
            Set<Long> theirWanted = theirStickers.stream()
                    .filter(us -> us.getStatus() == UserSticker.Status.NAO_TENHO)
                    .map(us -> us.getSticker().getId()).collect(Collectors.toSet());

            List<StickerResponse> iHave = myRepeated.stream()
                    .filter(us -> theirWanted.contains(us.getSticker().getId()))
                    .map(us -> stickerService.toStickerResponse(us.getSticker()))
                    .collect(Collectors.toList());

            if (theyHave.isEmpty() && iHave.isEmpty()) continue;

            MatchResponse m = new MatchResponse();
            m.setUserId(matchUser.getId());
            m.setUserName(matchUser.getName());
            m.setUserEmail(matchUser.getEmail());
            m.setTheyHaveWhatINeed(theyHave);
            m.setIHaveWhatTheyNeed(iHave);
            m.setMatchScore(theyHave.size() + iHave.size());
            matches.add(m);
        }

        matches.sort(Comparator.comparingInt(MatchResponse::getMatchScore).reversed());
        return matches;
    }
}
