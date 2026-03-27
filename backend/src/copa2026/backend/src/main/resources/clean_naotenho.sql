-- Remove todos os registros com status NAO_TENHO (não precisam mais existir)
-- Execute no SQL Editor do Supabase

DELETE FROM user_stickers WHERE status = 'NAO_TENHO';

-- Remove a coluna status (não é mais usada)
ALTER TABLE user_stickers DROP COLUMN IF EXISTS status;

SELECT 
  'Limpeza concluída!' AS status,
  (SELECT COUNT(*) FROM user_stickers) AS registros_restantes;
