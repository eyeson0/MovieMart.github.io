-- ============================================================================
-- MOVIE MART — Seed Data for Development and Testing
-- ============================================================================

-- Insert Genres
INSERT INTO genres (id, name, slug) VALUES
  ('a0000001-0000-0000-0000-000000000001', 'Action', 'action'),
  ('a0000001-0000-0000-0000-000000000002', 'Sci-Fi', 'sci-fi'),
  ('a0000001-0000-0000-0000-000000000003', 'Drama', 'drama'),
  ('a0000001-0000-0000-0000-000000000004', 'Thriller', 'thriller'),
  ('a0000001-0000-0000-0000-000000000005', 'Adventure', 'adventure'),
  ('a0000001-0000-0000-0000-000000000006', 'Animation', 'animation'),
  ('a0000001-0000-0000-0000-000000000007', 'Horror', 'horror'),
  ('a0000001-0000-0000-0000-000000000008', 'Romance', 'romance'),
  ('a0000001-0000-0000-0000-000000000009', 'Classics', 'classics')
ON CONFLICT (slug) DO NOTHING;

-- Insert Languages
INSERT INTO languages (id, code, name, native_name) VALUES
  ('b0000001-0000-0000-0000-000000000001', 'en', 'English', 'English'),
  ('b0000001-0000-0000-0000-000000000002', 'hi', 'Hindi', 'हिन्दी'),
  ('b0000001-0000-0000-0000-000000000003', 'ne', 'Nepali', 'नेपाली'),
  ('b0000001-0000-0000-0000-000000000004', 'ko', 'Korean', '한국어'),
  ('b0000001-0000-0000-0000-000000000005', 'ja', 'Japanese', '日本語')
ON CONFLICT (code) DO NOTHING;

-- Insert Ad Placements
INSERT INTO ad_placements (slot_key, name, placement_type, provider, is_enabled, cooldown_seconds) VALUES
  ('first_play_preroll', 'First-Play Disclosed Pre-roll', 'preroll', 'google_ad_manager', true, 300),
  ('rewarded_24h_pass', 'Movie Mart 24-Hour Ad-Free Pass', 'rewarded', 'google_ad_manager', true, 0),
  ('catalog_banner', 'Catalog Sponsored Showcase', 'banner', 'google_ad_manager', true, 0)
ON CONFLICT (slot_key) DO NOTHING;
