package com.copa2026.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.util.ArrayList;
import java.util.List;

@Data
public class MatchResponse {
    private Long userId;
    private String userName;
    private String userCode;
    private String userPhone;

    /** Figurinhas que EU posso RECEBER (repetidas deles que eu não tenho) */
    @JsonProperty("theyHaveWhatINeed")
    private List<StickerResponse> theyHaveWhatINeed = new ArrayList<>();

    /** Figurinhas que EU posso OFERECER (minhas repetidas que eles não têm) */
    @JsonProperty("iHaveWhatTheyNeed")
    private List<StickerResponse> iHaveWhatTheyNeed = new ArrayList<>();

    private int matchScore;
}
