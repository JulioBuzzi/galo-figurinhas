package com.copa2026.dto;

import lombok.Data;
import java.util.ArrayList;
import java.util.List;

@Data
public class MatchResponse {
    private Long userId;
    private String userName;
    private String userCode;   // código de 6 dígitos
    private String userPhone;  // só aparece se showPhone=true
    private List<StickerResponse> theyHaveWhatINeed = new ArrayList<>();
    private List<StickerResponse> iHaveWhatTheyNeed = new ArrayList<>();
    private int matchScore;
}