-- ============================================================
-- LIMPEZA FINAL DO BANCO — Execute no Supabase SQL Editor
-- ============================================================

-- 1. Remove TODOS os registros antigos com status NAO_TENHO (se ainda existirem)
DELETE FROM user_stickers WHERE status = 'NAO_TENHO';

-- 2. Remove coluna status (não é mais usada)
ALTER TABLE user_stickers DROP COLUMN IF EXISTS status;

-- 3. Garante que repeated_count nunca seja NULL
UPDATE user_stickers SET repeated_count = 0 WHERE repeated_count IS NULL;

-- Resultado
SELECT 
  'Banco limpo!' AS msg,
  COUNT(*) AS registros_restantes,
  SUM(repeated_count) AS total_repetidas
FROM user_stickers;
