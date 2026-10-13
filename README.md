# MOVIE MART — Full-Stack Streaming Platform

Movie Mart is a production-oriented movie discovery and legal streaming platform featuring a Netflix-inspired dark cinematic design (#090909 background, #181818 charcoal cards, #E50914 brand red), a relational database model (19 Supabase / PostgreSQL tables), authorized multi-server video players, and a compliant advertising reward system.

---

## 🚀 Key Features

1. **Netflix-Inspired Cinematic UI**
   - Immersive hero spotlight with dark vignette gradients, backdrop artwork, and ratings.
   - Dynamic horizontal rails:
     - Continue Watching (synchronized with user watch progress)
     - Trending Movies & Blockbusters
     - Popular Series & TV Shows
     - Hindi Dubbed Cinema
     - Nepali Cinema Releases
     - English & International Releases
     - Korean Series (K-Drama)
     - Anime & Animated Masterpieces
     - Public-Domain Classics (Pre-1928 & verified exemptions)
   - Real-time search with instant autocomplete and dedicated results view.
   - Categorized views: Movies, Series, Dubbed, and My List.

2. **Truthful Authorized Video Player**
   - Reusable player supporting HLS, MP4, and multi-server failover.
   - Controls: Play/Pause, Seekbar, Skip 10s, Volume/Mute, Playback Speed (0.5x to 2x), Fullscreen.
   - Audio Track Selector (Original English, Hindi Dubbed, Nepali, Japanese).
   - Subtitle Track Selector (English CC, Español, Off).
   - Multi-server switcher (Server 1 - Main HLS/MP4, Server 2 - Fast CDN Mirror, Server 3 - Backup).
   - **Truthful Error Handling**:
     - Missing source: *"Streaming is not available for this title yet."*
     - Server offline: *"This server is currently unavailable. Try again later or choose another available source."*
     - Network error: *"Unable to load the video. Check your connection and try again."*
   - Playback progress automatically saves every 5 seconds for seamless resume.

3. **Compliant Monetization & 24-Hour Ad-Free Pass**
   - **First-Play Pre-Roll**: Disclosed, non-intrusive 5-second pre-roll before movie playback for non-pass users.
   - **Movie Mart 24-Hour Ad-Free Pass**:
     - Users voluntarily choose to watch a single qualifying 10-second sponsored clip.
     - Backend generates a cryptographic attempt ID and verification token (`/api/ads/reward-attempt`).
     - Upon completion, the backend redeems the attempt (`/api/ads/redeem-reward`), prevents replay attacks, and registers an active 24-hour pass.
     - Live countdown badge in the navbar displays remaining time (e.g., `⚡ 23h 58m Ad-Free`).
     - Suppresses all video pre-roll placements while the pass is active.

4. **Administrator Operations Console (`/admin`)**
   - Overview metrics: Total Titles, Movies vs. Series, Active Sources, Health %, DMCA Notices.
   - Source Manager with **Live Health Probe**: ping any server with 1 click to check HTTP response and latency in milliseconds.
   - Title publisher: add new movies, series, or public domain records.
   - Monetization & Ad Placements: toggle pre-roll ads and 24-hour reward pass.
   - DMCA & Copyright Inquiries: review notices and take down offending sources with 1 click.
   - System Audit Log: chronological record of all administrative operations.

5. **Relational Database Model (19 Tables)**
   - Schema defined in `supabase/migrations/001_initial_schema.sql` and seeded via `supabase/seed.sql`:
     1. `profiles`
     2. `user_roles`
     3. `titles`
     4. `genres`
     5. `title_genres`
     6. `seasons`
     7. `episodes`
     8. `streaming_sources`
     9. `languages`
     10. `title_audio_languages`
     11. `title_subtitles`
     12. `watchlists`
     13. `watch_progress`
     14. `reward_attempts`
     15. `ad_free_passes`
     16. `ad_placements`
     17. `source_health_checks`
     18. `copyright_reports`
     19. `audit_logs`

---

## 🛠 Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Backend**: Express on Node.js 22 with Vite integration middleware
- **Database**: PostgreSQL / Supabase Schema (`supabase/migrations/001_initial_schema.sql`)
- **Testing**: Automated test suite (`tests/api.test.ts`) covering 8 critical test suites

---

## 🧪 Testing

Run automated tests:
```bash
npm run test
```

Verifies:
- Catalog and category retrieval
- Truthful player error handling (unlicensed catalog titles)
- Multi-server switching and offline server detection
- Watchlist isolation across users
- Playback progress tracking
- 24-Hour Ad-Free pass issuance
- Replay attack and duplicate redemption prevention
- DMCA complaint submission and resolution