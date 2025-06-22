-- Remove full_name field from users table
ALTER TABLE public.users 
DROP COLUMN IF EXISTS full_name; 