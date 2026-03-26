package com.copa2026.dto;

import lombok.Data;
import java.util.ArrayList;
import java.util.List;

@Data
public class MatchResponse {
    private Long userId;
    private String userName;
    private String userEmail;
    /** Figurinhas que o outro tem REPETIDA que EU preciso */
    private List<StickerResponse> theyHaveWhatINeed = new ArrayList<>();
    /** Minhas REPETIDAS que o outro precisa */
    private List<StickerResponse> iHaveWhatTheyNeed = new ArrayList<>();
    private int matchScore;
}