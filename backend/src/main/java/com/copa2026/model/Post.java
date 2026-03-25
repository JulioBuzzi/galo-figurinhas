package com.copa2026.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Entidade que representa um post no feed.
 * Usuários publicam figurinhas que procuram e/ou têm repetidas para troca.
 */
@Entity
@Table(name = "posts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(columnDefinition = "TEXT")
    private String text;

    /**
     * IDs das figurinhas que o usuário está PROCURANDO.
     * Armazenado como lista em tabela separada.
     */
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "post_wanted_stickers", joinColumns = @JoinColumn(name = "post_id"))
    @Column(name = "sticker_id")
    @Builder.Default
    private List<Long> wantedStickerIds = new ArrayList<>();

    /**
     * IDs das figurinhas REPETIDAS que o usuário oferece para troca.
     */
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "post_offered_stickers", joinColumns = @JoinColumn(name = "post_id"))
    @Column(name = "sticker_id")
    @Builder.Default
    private List<Long> offeredStickerIds = new ArrayList<>();

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
