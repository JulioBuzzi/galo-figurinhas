-- Migration to add performance indexes to user_stickers table
-- This fixes N+1 query problems and improves album loading speed

-- Index on user_id for fast lookup of user's stickers
CREATE INDEX IF NOT EXISTS idx_user_stickers_user_id 
    ON user_stickers(user_id);

-- Index on (user_id, repeated_count) for repeated stickers queries
CREATE INDEX IF NOT EXISTS idx_user_stickers_user_repeated 
    ON user_stickers(user_id, repeated_count DESC);

-- Index on sticker_id for referential integrity queries
CREATE INDEX IF NOT EXISTS idx_user_stickers_sticker_id 
    ON user_stickers(sticker_id);

-- Composite index for better query planning on user+sticker lookups
CREATE INDEX IF NOT EXISTS idx_user_stickers_user_sticker 
    ON user_stickers(user_id, sticker_id);

-- Index on updated_at for sorting/filtering by date
CREATE INDEX IF NOT EXISTS idx_user_stickers_updated_at 
    ON user_stickers(updated_at DESC);
