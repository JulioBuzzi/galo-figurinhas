-- Adiciona coluna de código aleatório de 6 dígitos
ALTER TABLE users ADD COLUMN IF NOT EXISTS user_code VARCHAR(6) UNIQUE;

-- Gera códigos para usuários existentes
UPDATE users SET user_code = LPAD(FLOOR(RANDOM() * 900000 + 100000)::TEXT, 6, '0')
WHERE user_code IS NULL;

-- Torna obrigatório após popular
ALTER TABLE users ALTER COLUMN user_code SET NOT NULL;

SELECT 'user_code adicionado!' AS status, COUNT(*) AS usuarios FROM users;
