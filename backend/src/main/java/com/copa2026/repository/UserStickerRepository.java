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

    @Query("SELECT us FROM UserSticker us JOIN FETCH us.sticker WHERE us.user.id = :uid ORDER BY us.sticker.albumNumber ASC")
    List<UserSticker> findByUserIdWithSticker(@Param("uid") Long uid);

    @Query("SELECT COUNT(us) FROM UserSticker us WHERE us.user.id = :uid AND us.repeatedCount > 0")
    long countWithRepeatedByUserId(@Param("uid") Long uid);

    @Query("SELECT COALESCE(SUM(us.repeatedCount), 0) FROM UserSticker us WHERE us.user.id = :uid")
    long sumRepeatedByUserId(@Param("uid") Long uid);

    /**
     * IDs de stickers que o usuário POSSUI (tem registro = marcou como TENHO).
     * repeated_count pode ser 0 ou mais — não importa, o que importa é ter o registro.
     */
    @Query("SELECT us.sticker.id FROM UserSticker us WHERE us.user.id = :uid")
    Set<Long> findOwnedStickerIds(@Param("uid") Long uid);

    /**
     * IDs de stickers onde o usuário tem REPETIDAS (repeatedCount > 0).
     * Essas são as que ele pode OFERECER em uma troca.
     */
    @Query("SELECT us.sticker.id FROM UserSticker us WHERE us.user.id = :uid AND us.repeatedCount > 0")
    Set<Long> findRepeatedStickerIds(@Param("uid") Long uid);
}
