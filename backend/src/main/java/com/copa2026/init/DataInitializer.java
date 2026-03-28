package com.copa2026.init;

import com.copa2026.model.Sticker;
import com.copa2026.repository.StickerRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final StickerRepository stickerRepository;
    private final ObjectMapper objectMapper;

    @Override
    public void run(String... args) {
        try {
            long count = stickerRepository.count();
            if (count > 0) {
                log.info("✅ {} figurinhas já carregadas.", count);
                return;
            }
            log.info("📦 Carregando figurinhas do stickers.json...");

            ClassPathResource resource = new ClassPathResource("stickers.json");
            InputStream is = resource.getInputStream();
            List<Map<String, Object>> rawList =
                objectMapper.readValue(is, new TypeReference<>() {});

            List<Sticker> stickers = rawList.stream().map(raw -> {
                Sticker s = new Sticker();
                s.setAlbumNumber((Integer) raw.get("albumNumber"));
                s.setCode((String) raw.get("code"));
                s.setName((String) raw.get("name"));
                s.setTeam((String) raw.get("team"));
                return s;
            }).collect(Collectors.toList());

            stickerRepository.saveAll(stickers);
            log.info("🎉 {} figurinhas carregadas!", stickers.size());
        } catch (Exception e) {
            log.error("⚠️ Erro no DataInitializer: {}", e.getMessage());
        }
    }
}
