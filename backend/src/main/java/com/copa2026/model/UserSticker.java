package com.copa2026.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * Só existe registro quando o usuário marcou TENHO.
 * Ausência de registro = NAO_TENHO.
 * repeatedCount = quantas cópias extras além da principal.
 */
@Entity
@Table(
    name = "user_stickers",
    uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "sticker_id"})
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserSticker {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "sticker_id", nullable = false)
    private Sticker sticker;

    /** Quantidade de cópias repetidas (além da principal) */
    @Column(name = "repeated_count", nullable = false)
    @Builder.Default
    private Integer repeatedCount = 0;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}