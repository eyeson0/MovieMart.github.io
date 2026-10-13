export interface LanguageOption {
  code: string;
  name: string;
  isDubbed?: boolean;
  isOriginal?: boolean;
}

export interface SubtitleOption {
  code: string;
  label: string;
  vtt_url: string;
}

export interface Episode {
  id: string;
  episode_number: number;
  title: string;
  synopsis: string;
  duration_minutes: number;
  still_url: string;
}

export interface Season {
  id: string;
  season_number: number;
  name: string;
  episodes: Episode[];
}

export interface Title {
  id: string;
  title: string;
  slug: string;
  type: 'movie' | 'series';
  tagline: string;
  synopsis: string;
  poster_url: string;
  backdrop_url: string;
  release_year: number;
  release_date: string;
  duration_minutes: number;
  age_rating: string;
  genres: string[];
  languages: LanguageOption[];
  subtitles: SubtitleOption[];
  mart_rating: number;
  imdb_rating: number;
  rotten_tomatoes_pct: number;
  is_featured: boolean;
  is_trending: boolean;
  is_public_domain: boolean;
  region_category: 'hollywood' | 'hindi_dubbed' | 'nepali' | 'korean' | 'anime' | 'classics';
  seasons?: Season[];
}

export interface StreamingSource {
  id: string;
  title_id: string;
  episode_id?: string;
  provider_name: string;
  server_name: string;
  source_type: 'hls' | 'mp4' | 'dash' | 'embed';
  stream_url: string;
  authorized_origin: string;
  quality_label: string;
  is_active: boolean;
  health_status: 'operational' | 'degraded' | 'offline';
  latency_ms: number;
  license_reference: string;
  last_verified_at: string;
}

export interface WatchProgress {
  user_id: string;
  title_id: string;
  episode_id?: string;
  progress_seconds: number;
  duration_seconds: number;
  percentage: number;
  updated_at: string;
  title?: Title;
}

export interface AdFreePassStatus {
  hasActivePass: boolean;
  remainingSeconds: number;
  expiresAt?: string;
}

export interface AdPlacement {
  id: string;
  slot_key: string;
  name: string;
  placement_type: 'preroll' | 'rewarded' | 'banner';
  provider: string;
  is_enabled: boolean;
}

export interface CopyrightReport {
  id: string;
  title_id?: string;
  source_id?: string;
  claimant_name: string;
  claimant_email: string;
  infringing_url: string;
  original_work_description: string;
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  admin_notes?: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  admin_user: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  details: string;
  timestamp: string;
}
