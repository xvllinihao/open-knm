-- Add level column to existing flashcard_progress table
-- Safe version: handles all "already exists" cases

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

-- Create index for faster queries (if not exists)
CREATE INDEX IF NOT EXISTS flashcard_progress_user_id_level_idx
ON flashcard_progress(user_id, level);
