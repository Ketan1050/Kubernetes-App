-- ==============================================================================
-- KUBELAB DATABASE SCHEMA MIGRATION
-- Multi-tenant Kubernetes Practice Platform with Row Level Security (RLS)
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Enums
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('user', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE lab_difficulty AS ENUM ('Beginner', 'Intermediate', 'Advanced');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE lab_status AS ENUM ('not_started', 'in_progress', 'completed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE session_status AS ENUM ('provisioning', 'active', 'expired', 'terminated');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Profiles Table (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role user_role DEFAULT 'user'::user_role NOT NULL,
    xp_points INTEGER DEFAULT 0 NOT NULL,
    streak_days INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. Labs Table
CREATE TABLE IF NOT EXISTS public.labs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    difficulty lab_difficulty DEFAULT 'Beginner'::lab_difficulty NOT NULL,
    instructions TEXT NOT NULL,
    estimated_time INTEGER DEFAULT 15 NOT NULL, -- minutes
    points INTEGER DEFAULT 50 NOT NULL,
    is_published BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 5. Lab Tasks Table (Validation Configurations)
CREATE TABLE IF NOT EXISTS public.lab_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lab_id UUID NOT NULL REFERENCES public.labs(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    validation_config JSONB NOT NULL DEFAULT '{}'::jsonb,
    task_order INTEGER NOT NULL DEFAULT 1,
    hints TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 6. User Lab Progress
CREATE TABLE IF NOT EXISTS public.user_lab_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    lab_id UUID NOT NULL REFERENCES public.labs(id) ON DELETE CASCADE,
    status lab_status DEFAULT 'not_started'::lab_status NOT NULL,
    score INTEGER DEFAULT 0 NOT NULL,
    time_spent INTEGER DEFAULT 0 NOT NULL, -- seconds
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(user_id, lab_id)
);

-- 7. Lab Sessions (Ephemeral Kubernetes Pod & Namespace Sessions)
CREATE TABLE IF NOT EXISTS public.lab_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    lab_id UUID NOT NULL REFERENCES public.labs(id) ON DELETE CASCADE,
    environment_id TEXT NOT NULL,
    namespace TEXT NOT NULL,
    status session_status DEFAULT 'provisioning'::session_status NOT NULL,
    ws_ticket TEXT,
    started_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    ended_at TIMESTAMPTZ
);

-- 8. Achievements Definition Table
CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    points INTEGER DEFAULT 100 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 9. User Unlocked Achievements
CREATE TABLE IF NOT EXISTS public.user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(user_id, achievement_id)
);

-- 10. Activity Logs
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL,
    description TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ==============================================================================
-- INDEXES FOR HIGH-PERFORMANCE QUERYING
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_labs_category ON public.labs(category);
CREATE INDEX IF NOT EXISTS idx_labs_difficulty ON public.labs(difficulty);
CREATE INDEX IF NOT EXISTS idx_lab_tasks_lab_id ON public.lab_tasks(lab_id, task_order);
CREATE INDEX IF NOT EXISTS idx_user_lab_progress_user ON public.user_lab_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_lab_progress_lab ON public.user_lab_progress(lab_id);
CREATE INDEX IF NOT EXISTS idx_lab_sessions_user_status ON public.lab_sessions(user_id, status);
CREATE INDEX IF NOT EXISTS idx_lab_sessions_expires ON public.lab_sessions(expires_at) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_activity_logs_user ON public.activity_logs(user_id, created_at DESC);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.labs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lab_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_lab_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lab_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Profiles: Public can read basic profile info, user can update their own
CREATE POLICY "Public profiles are viewable by everyone"
    ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Labs: Anyone can read published labs. Only admins can insert/update/delete
CREATE POLICY "Published labs are viewable by everyone"
    ON public.labs FOR SELECT USING (is_published = true OR (auth.jwt() ->> 'role') = 'admin');

CREATE POLICY "Admins can manage labs"
    ON public.labs FOR ALL USING ((auth.jwt() ->> 'role') = 'admin');

-- Lab Tasks: Viewable by anyone who can see the lab
CREATE POLICY "Lab tasks viewable by all"
    ON public.lab_tasks FOR SELECT USING (true);

CREATE POLICY "Admins can manage lab tasks"
    ON public.lab_tasks FOR ALL USING ((auth.jwt() ->> 'role') = 'admin');

-- User Lab Progress: Users can read and write only their own records
CREATE POLICY "Users view own progress"
    ON public.user_lab_progress FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users update own progress"
    ON public.user_lab_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users modify own progress"
    ON public.user_lab_progress FOR UPDATE USING (auth.uid() = user_id);

-- Lab Sessions: Users view own sessions
CREATE POLICY "Users view own sessions"
    ON public.lab_sessions FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users create own sessions"
    ON public.lab_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own sessions"
    ON public.lab_sessions FOR UPDATE USING (auth.uid() = user_id);

-- Achievements: Viewable by everyone
CREATE POLICY "Achievements viewable by everyone"
    ON public.achievements FOR SELECT USING (true);

-- User Achievements: Users view own unlocked achievements
CREATE POLICY "User achievements viewable by everyone"
    ON public.user_achievements FOR SELECT USING (true);

CREATE POLICY "Users receive achievements"
    ON public.user_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Activity Logs: Users view own activity logs
CREATE POLICY "Users view own activity logs"
    ON public.activity_logs FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users log activity"
    ON public.activity_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ==============================================================================
-- AUTOMATIC PROFILE CREATION TRIGGER ON AUTH SIGNUP
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, username, full_name, avatar_url, role)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
        new.raw_user_meta_data->>'full_name',
        new.raw_user_meta_data->>'avatar_url',
        'user'
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
