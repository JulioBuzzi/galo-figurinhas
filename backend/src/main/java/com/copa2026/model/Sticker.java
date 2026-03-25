package com.copa2026.model;

import jakarta.persistence.*;
import lombok.*;

/**
 * Entidade que representa uma figurinha do álbum da Copa 2026.
 * Todas as figurinhas têm o mesmo peso — sem raridade.
 */
@Entity
@Table(name = "stickers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Sticker {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Código único da figurinha (ex: FIG-001) */
    @Column(nullable = false, unique = true)
    private String code;

    /** Nome descritivo (ex: Figurinha 001) */
    @Column(nullable = false)
    private String name;

    /** Seleção ou seção do álbum (ex: Brasil, Abertura) */
    @Column(nullable = false)
    private String team;

    /** Número de ordem no álbum (1–980) */
    @Column(name = "album_number")
    private Integer albumNumber;
}
