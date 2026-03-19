-- Add level column to existing flashcard_progress table
-- Run this if the table already exists

-- Add level column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'flashcard_progress' AND column_name = 'level'
  ) THEN
    ALTER TABLE flashcard_progress ADD COLUMN level TEXT NOT NULL DEFAULT 'A2';
  END IF;
END $$;

-- Drop the old unique constraint if it exists (on user_id only)
ALTER TABLE flashcard_progress DROP CONSTRAINT IF EXISTS flashcard_progress_user_id_key;

-- Add new unique constraint for user_id + level
ALTER TABLE flashcard_progress ADD CONSTRAINT flashcard_progress_user_id_level_key UNIQUE (user_id, level);

-- Create index for faster queries (if not exists)
CREATE INDEX IF NOT EXISTS flashcard_progress_user_id_level_idx
ON flashcard_progress(user_id, level);
