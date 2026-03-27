package com.copa2026.service;

import com.copa2026.dto.ConfirmTradeRequest;
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
import org.springframework.transaction.annotation.Transactional;

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

    /**
     * Calcula trocas possíveis entre dois usuários.
     *
     * theyGiveMe = stickers com repeatedCount > 0 do OUTRO que EU não possuo (sem registro)
     * iGiveThem  = meus stickers com repeatedCount > 0 que o OUTRO não possui (sem registro)
     */
    public MatchResponse findMatchBetween(Long myUserId, Long targetUserId) {

        User target = userRepository.findById(targetUserId)
                .orElseThrow(() -> new RuntimeException(
                        "Nenhum colecionador encontrado com o código "
                        + String.format("%06d", targetUserId)));

        if (myUserId.equals(targetUserId)) {
            throw new RuntimeException("Você não pode fazer match com você mesmo!");
        }

        // Busca direto no banco — conjuntos de IDs
        Set<Long> myOwnedIds       = userStickerRepository.findStickerIdsByUserId(myUserId);
        Set<Long> myRepeatedIds    = userStickerRepository.findRepeatedStickerIdsByUserId(myUserId);
        Set<Long> theirOwnedIds    = userStickerRepository.findStickerIdsByUserId(targetUserId);
        Set<Long> theirRepeatedIds = userStickerRepository.findRepeatedStickerIdsByUserId(targetUserId);

        log.info("Match {} x {}: myOwned={} myRepeated={} theirOwned={} theirRepeated={}",
                myUserId, targetUserId,
                myOwnedIds.size(), myRepeatedIds.size(),
                theirOwnedIds.size(), theirRepeatedIds.size());

        /*
         * theyGiveMe: stickers que O OUTRO tem como repetida
         *             E que EU não tenho (sem registro)
         */
        Set<Long> theyGiveMeIds = new HashSet<>(theirRepeatedIds);
        theyGiveMeIds.removeAll(myOwnedIds);

        /*
         * iGiveThem: meus stickers com repetida
         *            E que O OUTRO não tem (sem registro)
         */
        Set<Long> iGiveThemIds = new HashSet<>(myRepeatedIds);
        iGiveThemIds.removeAll(theirOwnedIds);

        List<StickerResponse> theyGiveMe = resolveStickers(theyGiveMeIds);
        List<StickerResponse> iGiveThem  = resolveStickers(iGiveThemIds);
        int score = theyGiveMe.size() + iGiveThem.size();

        log.info("Resultado: theyGiveMe={} iGiveThem={} score={}",
                theyGiveMe.size(), iGiveThem.size(), score);

        MatchResponse r = new MatchResponse();
        r.setUserId(target.getId());
        r.setUserName(target.getName());
        r.setUserCode(String.format("%06d", target.getId()));
        if (Boolean.TRUE.equals(target.getShowPhone()) && target.getPhone() != null) {
            r.setUserPhone(formatPhone(target.getPhone()));
        }
        r.setTheyHaveWhatINeed(theyGiveMe);
        r.setIHaveWhatTheyNeed(iGiveThem);
        r.setMatchScore(score);
        return r;
    }

    /**
     * Confirma uma troca realizada:
     *
     * Para cada sticker RECEBIDO (receivedStickerIds):
     *   - Se não tenho registro → cria (agora tenho)
     *   - Se já tenho           → incrementa repeatedCount (ganhou mais uma cópia)
     *
     * Para cada sticker DADO (givenStickerIds):
     *   - Diminui repeatedCount em 1
     *   - Se repeatedCount chegar a 0, mantém o registro (ainda tenho a principal)
     */
    @Transactional
    public void confirmTrade(Long myUserId, ConfirmTradeRequest req) {
        User me = userRepository.findById(myUserId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        // Processa stickers recebidos
        for (Long stickerId : req.getReceivedStickerIds()) {
            var existing = userStickerRepository.findByUserIdAndStickerId(myUserId, stickerId);
            if (existing.isPresent()) {
                // Já tenho → incrementa repetida (recebi mais uma cópia)
                UserSticker us = existing.get();
                us.setRepeatedCount(us.getRepeatedCount() + 1);
                userStickerRepository.save(us);
            } else {
                // Não tenho → cria registro (agora tenho)
                var sticker = stickerRepository.findById(stickerId)
                        .orElseThrow(() -> new RuntimeException("Figurinha não encontrada: " + stickerId));
                UserSticker us = new UserSticker();
                us.setUser(me);
                us.setSticker(sticker);
                us.setRepeatedCount(0);
                userStickerRepository.save(us);
            }
        }

        // Processa stickers dados
        for (Long stickerId : req.getGivenStickerIds()) {
            var existing = userStickerRepository.findByUserIdAndStickerId(myUserId, stickerId);
            if (existing.isPresent()) {
                UserSticker us = existing.get();
                int newCount = Math.max(0, us.getRepeatedCount() - 1);
                us.setRepeatedCount(newCount);
                userStickerRepository.save(us);
                // Nota: não deletamos o registro mesmo com repeatedCount=0
                // pois o usuário ainda possui a figurinha principal
            }
        }

        log.info("Troca confirmada: user={} recebeu={} deu={}",
                myUserId, req.getReceivedStickerIds().size(), req.getGivenStickerIds().size());
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