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

/**
 * Lógica de match entre dois colecionadores.
 *
 * canReceive (EU posso receber do OUTRO):
 *   = stickers com repeatedCount > 0 do OUTRO
 *     que EU não tenho (sem registro em user_stickers)
 *
 * canOffer (EU posso oferecer ao OUTRO):
 *   = meus stickers com repeatedCount > 0
 *     que o OUTRO não tem (sem registro em user_stickers)
 *
 * "Não ter" = ausência de linha em user_stickers.
 * Linha existindo = usuário marcou como TENHO (repeatedCount >= 0).
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class MatchService {

    private final UserStickerRepository userStickerRepository;
    private final UserRepository        userRepository;
    private final StickerRepository     stickerRepository;
    private final StickerService        stickerService;

    public MatchResponse findMatchByCode(Long myUserId, String targetCode) {

        User target = userRepository.findByUserCode(targetCode)
                .orElseThrow(() -> new RuntimeException(
                        "Nenhum colecionador com o código " + targetCode + " foi encontrado."));

        if (myUserId.equals(target.getId())) {
            throw new RuntimeException("Este é o seu próprio código!");
        }

        Long theirUserId = target.getId();

        // ── O que EU tenho (todos os registros = marcados como TENHO) ──
        Set<Long> myOwned    = userStickerRepository.findOwnedStickerIds(myUserId);

        // ── Minhas REPETIDAS (repeatedCount > 0) — posso oferecer ──
        Set<Long> myRepeated = userStickerRepository.findRepeatedStickerIds(myUserId);

        // ── O que o OUTRO tem ──
        Set<Long> theirOwned    = userStickerRepository.findOwnedStickerIds(theirUserId);

        // ── REPETIDAS do OUTRO — ele pode oferecer ──
        Set<Long> theirRepeated = userStickerRepository.findRepeatedStickerIds(theirUserId);

        log.info("=== MATCH {} x {} ===", myUserId, theirUserId);
        log.info("  EU tenho: {} figurinhas, {} repetidas", myOwned.size(), myRepeated.size());
        log.info("  OUTRO tem: {} figurinhas, {} repetidas", theirOwned.size(), theirRepeated.size());

        /*
         * canReceive = repetidas do OUTRO que EU NÃO TENHO
         *
         * Iteração: para cada figurinha com repeatedCount > 0 do OUTRO,
         * verifico se EU tenho (ou seja, se existe linha em user_stickers para mim).
         * Se EU NÃO tenho → posso receber.
         */
        Set<Long> canReceiveIds = new HashSet<>(theirRepeated);
        canReceiveIds.removeAll(myOwned); // remove as que eu já tenho

        /*
         * canOffer = minhas repetidas que o OUTRO NÃO TEM
         *
         * Para cada minha figurinha com repeatedCount > 0,
         * verifico se o OUTRO tem.
         * Se o OUTRO NÃO tem → posso oferecer.
         */
        Set<Long> canOfferIds = new HashSet<>(myRepeated);
        canOfferIds.removeAll(theirOwned); // remove as que o outro já tem

        log.info("  canReceive: {} | canOffer: {}", canReceiveIds.size(), canOfferIds.size());

        List<StickerResponse> canReceive = resolveStickers(canReceiveIds);
        List<StickerResponse> canOffer   = resolveStickers(canOfferIds);

        MatchResponse r = new MatchResponse();
        r.setUserId(target.getId());
        r.setUserName(target.getName());
        r.setUserCode(target.getUserCode());
        if (Boolean.TRUE.equals(target.getShowPhone()) && target.getPhone() != null) {
            r.setUserPhone(formatPhone(target.getPhone()));
        }
        r.setTheyHaveWhatINeed(canReceive);
        r.setIHaveWhatTheyNeed(canOffer);
        r.setMatchScore(canReceive.size() + canOffer.size());
        return r;
    }

    @Transactional
    public void confirmTrade(Long myUserId, ConfirmTradeRequest req) {
        User me = userRepository.findById(myUserId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        // Figurinhas recebidas → adiciona ao álbum
        for (Long stickerId : req.getReceivedStickerIds()) {
            var existing = userStickerRepository.findByUserIdAndStickerId(myUserId, stickerId);
            if (existing.isPresent()) {
                // Já tinha → incrementa repetida (ganhou mais uma cópia)
                UserSticker us = existing.get();
                us.setRepeatedCount(us.getRepeatedCount() + 1);
                userStickerRepository.save(us);
            } else {
                // Não tinha → agora tem
                var sticker = stickerRepository.findById(stickerId)
                        .orElseThrow(() -> new RuntimeException("Figurinha não encontrada: " + stickerId));
                UserSticker us = new UserSticker();
                us.setUser(me);
                us.setSticker(sticker);
                us.setRepeatedCount(0);
                userStickerRepository.save(us);
            }
        }

        // Figurinhas dadas → decrementa repetida
        for (Long stickerId : req.getGivenStickerIds()) {
            var existing = userStickerRepository.findByUserIdAndStickerId(myUserId, stickerId);
            if (existing.isPresent()) {
                UserSticker us = existing.get();
                int newCount = Math.max(0, us.getRepeatedCount() - 1);
                us.setRepeatedCount(newCount);
                userStickerRepository.save(us);
            }
        }

        log.info("Troca OK: user={} recebeu={} deu={}",
                myUserId,
                req.getReceivedStickerIds().size(),
                req.getGivenStickerIds().size());
    }

    private List<StickerResponse> resolveStickers(Set<Long> ids) {
        if (ids.isEmpty()) return Collections.emptyList();
        return stickerRepository.findAllById(ids).stream()
                .map(stickerService::toStickerResponse)
                .sorted(Comparator.comparing(StickerResponse::getAlbumNumber,
                        Comparator.nullsLast(Comparator.naturalOrder())))
                .collect(Collectors.toList());
    }

    private String formatPhone(String d) {
        if (d == null) return null;
        if (d.length() == 11) return String.format("(%s) %s-%s", d.substring(0,2), d.substring(2,7), d.substring(7));
        if (d.length() == 10) return String.format("(%s) %s-%s", d.substring(0,2), d.substring(2,6), d.substring(6));
        return d;
    }
}
