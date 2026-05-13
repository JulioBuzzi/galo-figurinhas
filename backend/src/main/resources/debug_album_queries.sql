-- Query para verificar as figurinhas marcadas de um usuário
-- Execute isso em seu banco de dados PostgreSQL para debug

-- 1. Ver todas as figurinhas marcadas de um usuário (substitua 1 pelo ID do usuário)
SELECT 
    us.id,
    us.user_id,
    us.sticker_id,
    s.code,
    s.name,
    s.team,
    s.album_number,
    us.repeated_count,
    us.updated_at
FROM user_stickers us
JOIN stickers s ON us.sticker_id = s.id
WHERE us.user_id = 1
ORDER BY s.album_number ASC;

-- 2. Contar quantas figurinhas o usuário marcou como "tenho"
SELECT COUNT(*) as total_stickers_owned
FROM user_stickers
WHERE user_id = 1;

-- 3. Contar figurinhas repetidas
SELECT COUNT(*) as stickers_with_repeats
FROM user_stickers
WHERE user_id = 1 AND repeated_count > 0;

-- 4. Total de repetidas
SELECT COALESCE(SUM(repeated_count), 0) as total_repeats
FROM user_stickers
WHERE user_id = 1;

-- 5. Progress completo
SELECT 
    (SELECT COUNT(*) FROM stickers) as total_stickers_album,
    (SELECT COUNT(*) FROM user_stickers WHERE user_id = 1) as user_owned,
    (SELECT COUNT(*) FROM stickers) - (SELECT COUNT(*) FROM user_stickers WHERE user_id = 1) as user_missing,
    (SELECT COUNT(*) FROM user_stickers WHERE user_id = 1 AND repeated_count > 0) as with_repeats,
    (SELECT COALESCE(SUM(repeated_count), 0) FROM user_stickers WHERE user_id = 1) as total_repeated
;

-- 6. Ver índices criados (para verificar se as otimizações foram aplicadas)
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'user_stickers'
ORDER BY indexname;

-- 7. Verificar performance: Executar EXPLAIN ANALYZE na query principal
EXPLAIN ANALYZE
SELECT us.id, us.user_id, us.sticker_id, s.code, s.name, s.team, s.album_number, us.repeated_count, us.updated_at
FROM user_stickers us
JOIN stickers s ON us.sticker_id = s.id
WHERE us.user_id = 1
ORDER BY s.album_number ASC;
