-- Create flashcard_progress table with level support
-- This allows tracking progress separately for A2, B1, and Mix levels

CREATE TABLE IF NOT EXISTS flashcard_progress (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  level TEXT NOT NULL DEFAULT 'A2',
  current_index INTEGER NOT NULL DEFAULT 0,
  deck_ids TEXT[] DEFAULT '{}',
  is_reverse BOOLEAN NOT NULL DEFAULT false,
  is_review_mode BOOLEAN NOT NULL DEFAULT false,
  is_review_known_mode BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, level)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS flashcard_progress_user_id_level_idx
ON flashcard_progress(user_id, level);

-- Enable Row Level Security
ALTER TABLE flashcard_progress ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can read their own progress
CREATE POLICY "Users can read own flashcard progress"
ON flashcard_progress FOR SELECT
USING (auth.uid() = user_id);

-- Create policy: Users can insert their own progress
CREATE POLICY "Users can insert own flashcard progress"
ON flashcard_progress FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can update their own progress
CREATE POLICY "Users can update own flashcard progress"
ON flashcard_progress FOR UPDATE
USING (auth.uid() = user_id);

