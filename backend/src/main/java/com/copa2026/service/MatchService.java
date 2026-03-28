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
     * Busca por userCode (6 dígitos aleatórios) em vez de ID.
     *
     * canReceive = repetidas do OUTRO ∩ faltantes do EU
     *            = theirRepeated - myOwned
     *
     * canOffer   = minhas repetidas ∩ faltantes do OUTRO
     *            = myRepeated - theirOwned
     */
    public MatchResponse findMatchByCode(Long myUserId, String targetCode) {

        User target = userRepository.findByUserCode(targetCode)
                .orElseThrow(() -> new RuntimeException(
                        "Nenhum colecionador encontrado com o código " + targetCode));

        if (myUserId.equals(target.getId())) {
            throw new RuntimeException("Este é o seu próprio código!");
        }

        Set<Long> myOwned       = userStickerRepository.findStickerIdsByUserId(myUserId);
        Set<Long> myRepeated    = userStickerRepository.findRepeatedStickerIdsByUserId(myUserId);
        Set<Long> theirOwned    = userStickerRepository.findStickerIdsByUserId(target.getId());
        Set<Long> theirRepeated = userStickerRepository.findRepeatedStickerIdsByUserId(target.getId());

        // Figurinhas que EU POSSO RECEBER:
        // repetidas deles que EU ainda não tenho
        Set<Long> canReceiveIds = new HashSet<>(theirRepeated);
        canReceiveIds.removeAll(myOwned);

        // Figurinhas que EU POSSO OFERECER:
        // minhas repetidas que ELES ainda não têm
        Set<Long> canOfferIds = new HashSet<>(myRepeated);
        canOfferIds.removeAll(theirOwned);

        List<StickerResponse> canReceive = resolveStickers(canReceiveIds);
        List<StickerResponse> canOffer   = resolveStickers(canOfferIds);

        log.info("Match {} x {}: canReceive={} canOffer={}",
                myUserId, target.getId(), canReceive.size(), canOffer.size());

        MatchResponse r = new MatchResponse();
        r.setUserId(target.getId());
        r.setUserName(target.getName());
        r.setUserCode(target.getUserCode());
        if (Boolean.TRUE.equals(target.getShowPhone()) && target.getPhone() != null) {
            r.setUserPhone(formatPhone(target.getPhone()));
        }
        r.setTheyHaveWhatINeed(canReceive);
        r.setIHaveWhatTheyNeed(canOffer);
        // Score = menor dos dois (trocas realmente possíveis = pares)
        r.setMatchScore(Math.min(canReceive.size(), canOffer.size()));
        return r;
    }

    @Transactional
    public void confirmTrade(Long myUserId, ConfirmTradeRequest req) {
        User me = userRepository.findById(myUserId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        // Figurinhas recebidas → adiciona ao álbum (ou incrementa se já tinha)
        for (Long stickerId : req.getReceivedStickerIds()) {
            var existing = userStickerRepository.findByUserIdAndStickerId(myUserId, stickerId);
            if (existing.isPresent()) {
                UserSticker us = existing.get();
                us.setRepeatedCount(us.getRepeatedCount() + 1);
                userStickerRepository.save(us);
            } else {
                var sticker = stickerRepository.findById(stickerId)
                        .orElseThrow(() -> new RuntimeException("Figurinha não encontrada: " + stickerId));
                UserSticker us = new UserSticker();
                us.setUser(me);
                us.setSticker(sticker);
                us.setRepeatedCount(0);
                userStickerRepository.save(us);
            }
        }

        // Figurinhas dadas → decrementa repeatedCount
        for (Long stickerId : req.getGivenStickerIds()) {
            var existing = userStickerRepository.findByUserIdAndStickerId(myUserId, stickerId);
            if (existing.isPresent()) {
                UserSticker us = existing.get();
                int newCount = Math.max(0, us.getRepeatedCount() - 1);
                us.setRepeatedCount(newCount);
                userStickerRepository.save(us);
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