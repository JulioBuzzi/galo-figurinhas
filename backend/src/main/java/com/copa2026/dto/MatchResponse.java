package com.copa2026.dto;

import lombok.Data;
import java.util.ArrayList;
import java.util.List;

@Data
public class MatchResponse {
    private Long userId;
    private String userName;
    private String userCode;
    private String userPhone;
    private List<StickerResponse> theyHaveWhatINeed = new ArrayList<>();
    private List<StickerResponse> iHaveWhatTheyNeed = new ArrayList<>();
    private int matchScore;
}
