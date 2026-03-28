-- Adiciona colunas de telefone à tabela users
-- Execute no SQL Editor do Supabase

ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(11);
ALTER TABLE users ADD COLUMN IF NOT EXISTS show_phone BOOLEAN NOT NULL DEFAULT false;

SELECT 'Colunas phone e show_phone adicionadas!' AS status;
