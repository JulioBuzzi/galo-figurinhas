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

/**
 * Carrega as 980 figurinhas a partir do arquivo stickers.json (src/main/resources).
 *
 * Por que JSON e não hardcoded?
 *  - Fácil de editar sem tocar em código Java
 *  - Fonte única da verdade para os dados do álbum
 *  - Ainda usa o banco para integridade referencial com user_stickers
 *  - Executado UMA VEZ: se já existem figurinhas, pula o seed
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final StickerRepository stickerRepository;
    private final ObjectMapper objectMapper;

    @Override
    public void run(String... args) throws Exception {
        if (stickerRepository.count() > 0) {
            log.info("✅ Figurinhas já carregadas ({} registros). Pulando seed.",
                     stickerRepository.count());
            return;
        }

        log.info("📦 Carregando figurinhas do stickers.json...");

        ClassPathResource resource = new ClassPathResource("stickers.json");
        InputStream is = resource.getInputStream();

        List<Map<String, Object>> rawList =
            objectMapper.readValue(is, new TypeReference<>() {});

        List<Sticker> stickers = rawList.stream().map(raw -> Sticker.builder()
            .albumNumber((Integer) raw.get("albumNumber"))
            .code((String) raw.get("code"))
            .name((String) raw.get("name"))
            .team((String) raw.get("team"))
            .build()
        ).collect(Collectors.toList());

        stickerRepository.saveAll(stickers);
        log.info("🎉 {} figurinhas carregadas com sucesso!", stickers.size());
    }
}
