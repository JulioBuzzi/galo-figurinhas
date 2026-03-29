package com.copa2026.service;

import com.copa2026.dto.*;
import com.copa2026.model.*;
import com.copa2026.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StickerService {

    private final StickerRepository     stickerRepository;
    private final UserStickerRepository userStickerRepository;
    private final UserRepository        userRepository;

    public List<StickerResponse> getAllStickers() {
        return stickerRepository.findAll().stream()
                .map(this::toStickerResponse)
                .collect(Collectors.toList());
    }

    public List<UserStickerResponse> getUserAlbum(Long userId) {
        List<Sticker> all = stickerRepository.findAll();
        Map<Long, UserSticker> myMap = userStickerRepository.findByUserId(userId)
                .stream()
                .collect(Collectors.toMap(us -> us.getSticker().getId(), us -> us));

        return all.stream().map(sticker -> {
            UserStickerResponse r = new UserStickerResponse();
            r.setStickerId(sticker.getId());
            r.setCode(sticker.getCode());
            r.setName(sticker.getName());
            r.setTeam(sticker.getTeam());
            r.setAlbumNumber(sticker.getAlbumNumber());

            UserSticker us = myMap.get(sticker.getId());
            if (us != null) {
                r.setOwned(true);
                r.setRepeatedCount(us.getRepeatedCount());
                r.setUpdatedAt(us.getUpdatedAt());
            } else {
                r.setOwned(false);
                r.setRepeatedCount(0);
            }
            return r;
        }).collect(Collectors.toList());
    }

    public List<UserStickerResponse> getUserOwnedStickers(Long userId) {
        return userStickerRepository.findByUserId(userId).stream()
                .map(us -> {
                    UserStickerResponse r = new UserStickerResponse();
                    r.setStickerId(us.getSticker().getId());
                    r.setCode(us.getSticker().getCode());
                    r.setName(us.getSticker().getName());
                    r.setTeam(us.getSticker().getTeam());
                    r.setAlbumNumber(us.getSticker().getAlbumNumber());
                    r.setOwned(true);
                    r.setRepeatedCount(us.getRepeatedCount());
                    r.setUpdatedAt(us.getUpdatedAt());
                    return r;
                }).collect(Collectors.toList());
    }

    @Transactional
    public UserStickerResponse toggleOwned(Long userId, Long stickerId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        Sticker sticker = stickerRepository.findById(stickerId)
                .orElseThrow(() -> new RuntimeException("Figurinha não encontrada"));

        var existing = userStickerRepository.findByUserIdAndStickerId(userId, stickerId);

        UserStickerResponse r = new UserStickerResponse();
        r.setStickerId(sticker.getId());
        r.setCode(sticker.getCode());
        r.setName(sticker.getName());
        r.setTeam(sticker.getTeam());
        r.setAlbumNumber(sticker.getAlbumNumber());

        if (existing.isPresent()) {
            userStickerRepository.delete(existing.get());
            r.setOwned(false);
            r.setRepeatedCount(0);
        } else {
            UserSticker us = new UserSticker();
            us.setUser(user);
            us.setSticker(sticker);
            us.setRepeatedCount(0);
            us = userStickerRepository.save(us);
            r.setOwned(true);
            r.setRepeatedCount(0);
            r.setUpdatedAt(us.getUpdatedAt());
        }
        return r;
    }

    @Transactional
    public UserStickerResponse updateRepeatedCount(Long userId, Long stickerId, int delta) {
        UserSticker us = userStickerRepository.findByUserIdAndStickerId(userId, stickerId)
                .orElseThrow(() -> new RuntimeException(
                        "Marque a figurinha como TENHO antes de adicionar repetidas"));

        int newCount = Math.max(0, us.getRepeatedCount() + delta);
        us.setRepeatedCount(newCount);
        us = userStickerRepository.save(us);

        UserStickerResponse r = new UserStickerResponse();
        r.setStickerId(us.getSticker().getId());
        r.setCode(us.getSticker().getCode());
        r.setName(us.getSticker().getName());
        r.setTeam(us.getSticker().getTeam());
        r.setAlbumNumber(us.getSticker().getAlbumNumber());
        r.setOwned(true);
        r.setRepeatedCount(us.getRepeatedCount());
        r.setUpdatedAt(us.getUpdatedAt());
        return r;
    }

    public AlbumProgressResponse getAlbumProgress(Long userId) {
        long total          = stickerRepository.count();
        long tenho          = userStickerRepository.countByUserId(userId);
        long naoTenho       = total - tenho;
        long comRepetidas   = userStickerRepository.countWithRepeatedByUserId(userId);
        long totalRepetidas = userStickerRepository.sumRepeatedByUserId(userId);
        double pct = total > 0 ? Math.round((double) tenho / total * 1000.0) / 10.0 : 0;
        return new AlbumProgressResponse(total, tenho, naoTenho, comRepetidas, totalRepetidas, pct);
    }

    public StickerResponse toStickerResponse(Sticker s) {
        StickerResponse r = new StickerResponse();
        r.setId(s.getId());
        r.setCode(s.getCode());
        r.setName(s.getName());
        r.setTeam(s.getTeam());
        r.setAlbumNumber(s.getAlbumNumber());
        return r;
    }
}
