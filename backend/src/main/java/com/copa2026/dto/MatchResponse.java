package com.copa2026.dto;

import lombok.Data;
import java.util.List;

@Data
public class MatchResponse {
    private Long userId;
    private String userName;
    private String userEmail;
    /** Figurinhas que este usuário TEM que eu preciso */
    private List<StickerResponse> theyHaveWhatINeed;
    /** Minhas REPETIDAS que este usuário precisa */
    private List<StickerResponse> iHaveWhatTheyNeed;
    /** Pontuação do match: soma das trocas possíveis */
    private int matchScore;
}
