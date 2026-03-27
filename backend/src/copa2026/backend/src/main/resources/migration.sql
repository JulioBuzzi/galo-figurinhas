-- ================================================================
-- MIGRATION COMPLETA — Galo Figurinhas 2026
-- Execute no SQL Editor do Supabase ANTES de subir o backend
-- ================================================================

CREATE TABLE IF NOT EXISTS users (
    id         BIGSERIAL PRIMARY KEY,
    name       VARCHAR(255) NOT NULL,
    email      VARCHAR(255) NOT NULL UNIQUE,
    password   VARCHAR(255) NOT NULL,
    created_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS stickers (
    id           BIGSERIAL PRIMARY KEY,
    code         VARCHAR(50)  NOT NULL UNIQUE,
    name         VARCHAR(255) NOT NULL,
    team         VARCHAR(100) NOT NULL,
    album_number INT
);

CREATE TABLE IF NOT EXISTS user_stickers (
    id             BIGSERIAL PRIMARY KEY,
    user_id        BIGINT NOT NULL REFERENCES users(id),
    sticker_id     BIGINT NOT NULL REFERENCES stickers(id),
    status         VARCHAR(20) NOT NULL DEFAULT 'NAO_TENHO',
    repeated_count INT NOT NULL DEFAULT 0,
    updated_at     TIMESTAMP,
    UNIQUE(user_id, sticker_id)
);

CREATE TABLE IF NOT EXISTS posts (
    id         BIGSERIAL PRIMARY KEY,
    user_id    BIGINT NOT NULL REFERENCES users(id),
    text       TEXT,
    created_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS post_wanted_stickers (
    post_id    BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    sticker_id BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS post_offered_stickers (
    post_id    BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    sticker_id BIGINT NOT NULL
);

SELECT 'Tabelas criadas!' AS status;
