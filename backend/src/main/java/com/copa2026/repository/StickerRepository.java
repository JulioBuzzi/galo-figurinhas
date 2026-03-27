package com.copa2026.repository;

import com.copa2026.model.Sticker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface StickerRepository extends JpaRepository<Sticker, Long> {
    List<Sticker> findByTeam(String team);
    boolean existsByCode(String code);
}
