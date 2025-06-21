-- Add tag and description fields to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS tag TEXT,
ADD COLUMN IF NOT EXISTS description TEXT;

-- Update existing users to have default values
UPDATE public.users 
SET 
  tag = COALESCE(tag, ''),
  description = COALESCE(description, '')
WHERE tag IS NULL OR description IS NULL; 