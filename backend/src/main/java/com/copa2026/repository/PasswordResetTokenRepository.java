package com.copa2026.repository;

import com.copa2026.model.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

    void deleteByUserId(Long userId);

    @Query("SELECT p FROM PasswordResetToken p WHERE p.user.id = :uid ORDER BY p.createdAt DESC LIMIT 1")
    Optional<PasswordResetToken> findLatestByUserId(@Param("uid") Long uid);
}