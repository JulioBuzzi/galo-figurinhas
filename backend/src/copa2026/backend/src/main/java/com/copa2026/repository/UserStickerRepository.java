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

    /** Conta figurinhas que o usuário tem (registros no banco) */
    long countByUserId(Long userId);

    /** Conta figurinhas com pelo menos 1 repetida */
    @Query("SELECT COUNT(us) FROM UserSticker us WHERE us.user.id = :userId AND us.repeatedCount > 0")
    long countWithRepeatedByUserId(@Param("userId") Long userId);

    /** Soma total de repetidas */
    @Query("SELECT COALESCE(SUM(us.repeatedCount), 0) FROM UserSticker us WHERE us.user.id = :userId")
    long sumRepeatedByUserId(@Param("userId") Long userId);

    /** IDs de stickers que o usuário TEM */
    @Query("SELECT us.sticker.id FROM UserSticker us WHERE us.user.id = :userId")
    Set<Long> findStickerIdsByUserId(@Param("userId") Long userId);

    /** IDs de stickers com repetidas */
    @Query("SELECT us.sticker.id FROM UserSticker us WHERE us.user.id = :userId AND us.repeatedCount > 0")
    Set<Long> findRepeatedStickerIdsByUserId(@Param("userId") Long userId);
}
