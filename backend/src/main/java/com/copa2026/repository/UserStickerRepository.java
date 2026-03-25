package com.copa2026.repository;

import com.copa2026.model.UserSticker;
import com.copa2026.model.UserSticker.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserStickerRepository extends JpaRepository<UserSticker, Long> {

    List<UserSticker> findByUserId(Long userId);

    Optional<UserSticker> findByUserIdAndStickerId(Long userId, Long stickerId);

    List<UserSticker> findByUserIdAndStatus(Long userId, Status status);

    long countByUserIdAndStatus(Long userId, Status status);

    /** Figurinhas com pelo menos 1 repetida */
    @Query("SELECT COUNT(us) FROM UserSticker us WHERE us.user.id = :userId AND us.repeatedCount > 0")
    long countByUserIdWithRepeated(@Param("userId") Long userId);

    /** Soma total de todas as cópias repetidas */
    @Query("SELECT COALESCE(SUM(us.repeatedCount), 0) FROM UserSticker us WHERE us.user.id = :userId")
    long sumRepeatedCountByUserId(@Param("userId") Long userId);

    /** Usuários que TÊM figurinhas que eu preciso (NAO_TENHO) */
    @Query("""
        SELECT DISTINCT us.user.id FROM UserSticker us
        WHERE us.sticker.id IN (
            SELECT us2.sticker.id FROM UserSticker us2
            WHERE us2.user.id = :userId AND us2.status = 'NAO_TENHO'
        )
        AND us.status = 'TENHO'
        AND us.user.id <> :userId
    """)
    List<Long> findUsersWhoHaveMyWanted(@Param("userId") Long userId);

    /** Usuários que precisam das minhas repetidas */
    @Query("""
        SELECT DISTINCT us.user.id FROM UserSticker us
        WHERE us.sticker.id IN (
            SELECT us2.sticker.id FROM UserSticker us2
            WHERE us2.user.id = :userId AND us2.repeatedCount > 0
        )
        AND us.status = 'NAO_TENHO'
        AND us.user.id <> :userId
    """)
    List<Long> findUsersWhoNeedMyRepeated(@Param("userId") Long userId);
}
