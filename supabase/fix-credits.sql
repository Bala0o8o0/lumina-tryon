-- Run this in your Supabase SQL Editor to fix your current user's credits

-- 1. Update the function to give new users 20 credits
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, credits)
  VALUES (NEW.id, NEW.email, 20);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Give your existing user 20 credits (if they have 0)
UPDATE users 
SET credits = 20 
WHERE credits = 0;

-- 3. Verify credits
SELECT id, email, credits FROM users;
