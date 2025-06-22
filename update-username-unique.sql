-- Add unique constraint to username field
ALTER TABLE public.users 
ADD CONSTRAINT users_username_unique UNIQUE (username);

-- Update existing users with null username to have a default value
UPDATE public.users 
SET username = 'user_' || substr(md5(random()::text), 1, 8)
WHERE username IS NULL OR username = ''; 