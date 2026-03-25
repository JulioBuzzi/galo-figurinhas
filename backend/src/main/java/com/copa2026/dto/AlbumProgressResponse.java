package com.copa2026.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AlbumProgressResponse {
    private long total;
    private long tenho;
    private long naoTenho;
    private long comRepetidas;   // figurinhas que têm pelo menos 1 repetida
    private long totalRepetidas; // soma total de todas as cópias extras
    private double completionPercent;
}
