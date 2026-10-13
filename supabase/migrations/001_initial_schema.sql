-- ============================================================================
-- MOVIE MART — PostgreSQL / Supabase Database Schema
-- Migration 001: Initial Full-Stack Schema (19 Tables)
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL,
  email TEXT NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  preferred_audio_language TEXT DEFAULT 'en',
  autoplay_trailers BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. USER ROLES
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'moderator', 'admin')),
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- 3. TITLES (Movies & TV Series)
CREATE TABLE IF NOT EXISTS titles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('movie', 'series')),
  tagline TEXT,
  synopsis TEXT NOT NULL,
  poster_url TEXT NOT NULL,
  backdrop_url TEXT NOT NULL,
  release_year INTEGER NOT NULL,
  release_date DATE,
  duration_minutes INTEGER,
  age_rating TEXT DEFAULT 'PG-13',
  tmdb_id INTEGER,
  imdb_id TEXT,
  mart_rating NUMERIC(3,1) DEFAULT 8.0,
  imdb_rating NUMERIC(3,1),
  rotten_tomatoes_pct INTEGER,
  is_featured BOOLEAN DEFAULT false,
  is_trending BOOLEAN DEFAULT false,
  is_public_domain BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. GENRES
CREATE TABLE IF NOT EXISTS genres (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL
);

-- 5. TITLE_GENRES
CREATE TABLE IF NOT EXISTS title_genres (
  title_id UUID NOT NULL REFERENCES titles(id) ON DELETE CASCADE,
  genre_id UUID NOT NULL REFERENCES genres(id) ON DELETE CASCADE,
  PRIMARY KEY (title_id, genre_id)
);

-- 6. SEASONS
CREATE TABLE IF NOT EXISTS seasons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title_id UUID NOT NULL REFERENCES titles(id) ON DELETE CASCADE,
  season_number INTEGER NOT NULL,
  name TEXT NOT NULL,
  overview TEXT,
  poster_url TEXT,
  air_date DATE,
  UNIQUE(title_id, season_number)
);

-- 7. EPISODES
CREATE TABLE IF NOT EXISTS episodes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  season_id UUID NOT NULL REFERENCES seasons(id) ON DELETE CASCADE,
  episode_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  synopsis TEXT,
  duration_minutes INTEGER,
  still_url TEXT,
  air_date DATE,
  UNIQUE(season_id, episode_number)
);

-- 8. STREAMING SOURCES (Verified & Authorized Content)
CREATE TABLE IF NOT EXISTS streaming_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title_id UUID NOT NULL REFERENCES titles(id) ON DELETE CASCADE,
  episode_id UUID REFERENCES episodes(id) ON DELETE CASCADE,
  provider_name TEXT NOT NULL,
  server_name TEXT NOT NULL,
  source_type TEXT NOT NULL CHECK (source_type IN ('hls', 'mp4', 'dash', 'embed')),
  stream_url TEXT NOT NULL,
  authorized_origin TEXT NOT NULL,
  quality_label TEXT DEFAULT '1080p Full HD',
  is_active BOOLEAN DEFAULT true,
  health_status TEXT DEFAULT 'operational' CHECK (health_status IN ('operational', 'degraded', 'offline')),
  latency_ms INTEGER DEFAULT 45,
  license_reference TEXT,
  last_verified_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. LANGUAGES
CREATE TABLE IF NOT EXISTS languages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL, -- 'en', 'hi', 'ne', 'ko', 'ja', 'es'
  name TEXT NOT NULL,
  native_name TEXT NOT NULL
);

-- 10. TITLE_AUDIO_LANGUAGES (Dubbed and Original Audio)
CREATE TABLE IF NOT EXISTS title_audio_languages (
  title_id UUID NOT NULL REFERENCES titles(id) ON DELETE CASCADE,
  language_id UUID NOT NULL REFERENCES languages(id) ON DELETE CASCADE,
  is_original BOOLEAN DEFAULT false,
  is_dubbed BOOLEAN DEFAULT false,
  PRIMARY KEY (title_id, language_id)
);

-- 11. TITLE_SUBTITLES
CREATE TABLE IF NOT EXISTS title_subtitles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title_id UUID NOT NULL REFERENCES titles(id) ON DELETE CASCADE,
  language_id UUID NOT NULL REFERENCES languages(id) ON DELETE CASCADE,
  vtt_url TEXT NOT NULL,
  label TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false
);

-- 12. WATCHLISTS (My List)
CREATE TABLE IF NOT EXISTS watchlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title_id UUID NOT NULL REFERENCES titles(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, title_id)
);

-- 13. WATCH_PROGRESS (Continue Watching)
CREATE TABLE IF NOT EXISTS watch_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title_id UUID NOT NULL REFERENCES titles(id) ON DELETE CASCADE,
  episode_id UUID REFERENCES episodes(id) ON DELETE CASCADE,
  progress_seconds INTEGER NOT NULL DEFAULT 0,
  duration_seconds INTEGER NOT NULL DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, title_id, episode_id)
);

-- 14. REWARD_ATTEMPTS (Advertising Verification)
CREATE TABLE IF NOT EXISTS reward_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  session_token TEXT NOT NULL,
  ad_placement_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'started' CHECK (status IN ('started', 'completed', 'expired', 'failed')),
  verification_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. AD_FREE_PASSES (24-Hour Pass)
CREATE TABLE IF NOT EXISTS ad_free_passes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reward_attempt_id UUID REFERENCES reward_attempts(id) ON DELETE SET NULL,
  starts_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT true,
  granted_by TEXT DEFAULT 'reward_ad',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. AD_PLACEMENTS
CREATE TABLE IF NOT EXISTS ad_placements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slot_key TEXT UNIQUE NOT NULL, -- 'first_play_preroll', 'rewarded_24h_pass', 'catalog_banner'
  name TEXT NOT NULL,
  placement_type TEXT NOT NULL CHECK (placement_type IN ('preroll', 'rewarded', 'banner')),
  provider TEXT NOT NULL DEFAULT 'google_ad_manager',
  is_enabled BOOLEAN DEFAULT true,
  cooldown_seconds INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. SOURCE_HEALTH_CHECKS
CREATE TABLE IF NOT EXISTS source_health_checks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_id UUID NOT NULL REFERENCES streaming_sources(id) ON DELETE CASCADE,
  http_status INTEGER,
  latency_ms INTEGER,
  is_playable BOOLEAN NOT NULL,
  error_message TEXT,
  checked_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. COPYRIGHT_REPORTS (DMCA Complaints)
CREATE TABLE IF NOT EXISTS copyright_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title_id UUID REFERENCES titles(id) ON DELETE SET NULL,
  source_id UUID REFERENCES streaming_sources(id) ON DELETE SET NULL,
  claimant_name TEXT NOT NULL,
  claimant_email TEXT NOT NULL,
  infringing_url TEXT NOT NULL,
  original_work_description TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'investigating', 'resolved', 'dismissed')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- 19. AUDIT_LOGS
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Indexes for High Performance Queries
CREATE INDEX IF NOT EXISTS idx_titles_type ON titles(type);
CREATE INDEX IF NOT EXISTS idx_titles_slug ON titles(slug);
CREATE INDEX IF NOT EXISTS idx_titles_trending ON titles(is_trending);
CREATE INDEX IF NOT EXISTS idx_streaming_sources_title ON streaming_sources(title_id);
CREATE INDEX IF NOT EXISTS idx_watchlists_user ON watchlists(user_id);
CREATE INDEX IF NOT EXISTS idx_watch_progress_user ON watch_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_ad_free_passes_user ON ad_free_passes(user_id, expires_at);

-- Row Level Security (RLS) Enablement
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE watchlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE watch_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_free_passes ENABLE ROW LEVEL SECURITY;
ALTER TABLE copyright_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Sample RLS Policies
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own watchlist" ON watchlists
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their watch progress" ON watch_progress
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Public read for titles" ON titles
  FOR SELECT TO authenticated, anon USING (true);

CREATE POLICY "Public read for active streaming sources" ON streaming_sources
  FOR SELECT TO authenticated, anon USING (is_active = true);
