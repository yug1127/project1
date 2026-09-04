-- ==========================================
-- RankStreak Supabase Postgres Database Schema
-- ==========================================

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table (Users metadata)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    current_rank INT NOT NULL DEFAULT 1 CHECK (current_rank >= 1 AND current_rank <= 15),
    current_streak_days INT NOT NULL DEFAULT 0,
    days_this_month INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Daily Check-ins Table
CREATE TYPE checkin_status AS ENUM ('counted', 'void_recovery', 'missed');

CREATE TABLE IF NOT EXISTS public.daily_checkins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status checkin_status NOT NULL DEFAULT 'counted',
    checked_in_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    CONSTRAINT unique_user_date UNIQUE (user_id, date)
);

-- 3. Trusted Viewers Table (Read-Only Sharing)
CREATE TABLE IF NOT EXISTS public.trusted_viewers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    viewer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT unique_owner_viewer UNIQUE (owner_id, viewer_id),
    CONSTRAINT prevent_self_sharing CHECK (owner_id <> viewer_id)
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trusted_viewers ENABLE ROW LEVEL SECURITY;

-- Profiles RLS
CREATE POLICY "Profiles can be viewed by anyone authenticated or trusted" 
    ON public.profiles FOR SELECT 
    USING (
        auth.uid() = id OR 
        EXISTS (
            SELECT 1 FROM public.trusted_viewers 
            WHERE owner_id = profiles.id AND viewer_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own profile" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = id);

-- Daily Check-ins RLS:
-- SELECT allowed if viewer is the owner OR viewer is in owner's trusted_viewers list
CREATE POLICY "Checkins visible to owner or trusted viewers" 
    ON public.daily_checkins FOR SELECT 
    USING (
        auth.uid() = user_id OR 
        EXISTS (
            SELECT 1 FROM public.trusted_viewers 
            WHERE owner_id = daily_checkins.user_id AND viewer_id = auth.uid()
        )
    );

-- INSERT/UPDATE/DELETE on daily_checkins allowed ONLY if auth.uid() = user_id
CREATE POLICY "Checkins manageable only by owner" 
    ON public.daily_checkins FOR ALL 
    USING (auth.uid() = user_id);

-- Trusted Viewers RLS
CREATE POLICY "Users can see connections they own or are viewer in" 
    ON public.trusted_viewers FOR SELECT 
    USING (auth.uid() = owner_id OR auth.uid() = viewer_id);

CREATE POLICY "Users can insert trusted viewers for their own account" 
    ON public.trusted_viewers FOR INSERT 
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can remove trusted viewers for their own account" 
    ON public.trusted_viewers FOR DELETE 
    USING (auth.uid() = owner_id);

-- ==========================================
-- AUTOMATIC PROFILE CREATION TRIGGER
-- ==========================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, current_rank)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1), 'User_' || SUBSTRING(new.id::text, 1, 6)),
    1
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
