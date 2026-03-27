package com.copa2026.repository;

import com.copa2026.model.UserSticker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface UserStickerRepository extends JpaRepository<UserSticker, Long> {

    List<UserSticker> findByUserId(Long userId);

    Optional<UserSticker> findByUserIdAndStickerId(Long userId, Long stickerId);

    long countByUserId(Long userId);

    @Query("SELECT COUNT(us) FROM UserSticker us WHERE us.user.id = :uid AND us.repeatedCount > 0")
    long countWithRepeatedByUserId(@Param("uid") Long uid);

    @Query("SELECT COALESCE(SUM(us.repeatedCount), 0) FROM UserSticker us WHERE us.user.id = :uid")
    long sumRepeatedByUserId(@Param("uid") Long uid);

    /** Todos os IDs de stickers que o usuário possui (tem registro) */
    @Query("SELECT us.sticker.id FROM UserSticker us WHERE us.user.id = :uid")
    Set<Long> findStickerIdsByUserId(@Param("uid") Long uid);

    /** IDs de stickers onde repeatedCount > 0 */
    @Query("SELECT us.sticker.id FROM UserSticker us WHERE us.user.id = :uid AND us.repeatedCount > 0")
    Set<Long> findRepeatedStickerIdsByUserId(@Param("uid") Long uid);

    /** Busca UserStickers por lista de IDs de sticker */
    @Query("SELECT us FROM UserSticker us WHERE us.user.id = :uid AND us.sticker.id IN :stickerIds")
    List<UserSticker> findByUserIdAndStickerIdIn(@Param("uid") Long uid, @Param("stickerIds") List<Long> stickerIds);
}