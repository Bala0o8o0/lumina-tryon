-- Users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  credits INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Generations table
CREATE TABLE generations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  output_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Purchases table
CREATE TABLE purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  credits_added INTEGER NOT NULL,
  payment_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own data" ON users
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert generations" ON generations
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own generations" ON generations
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert purchases" ON purchases
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own purchases" ON purchases
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, credits)
  VALUES (NEW.id, NEW.email, 20);  -- Give 20 free credits to new users
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update user credits
CREATE OR REPLACE FUNCTION update_user_credits(user_id_input UUID, amount INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE users
  SET credits = GREATEST(credits + amount, 0)
  WHERE id = user_id_input;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create storage bucket for try-on outputs
INSERT INTO storage.buckets (id, name, public)
VALUES ('tryon-outputs', 'tryon-outputs', false);

-- Create policies for storage bucket
CREATE POLICY "Users can upload try-on outputs" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'tryon-outputs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can read own try-on outputs" ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'tryon-outputs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update own try-on outputs" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'tryon-outputs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own try-on outputs" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'tryon-outputs' AND auth.uid()::text = (storage.foldername(name))[1]);