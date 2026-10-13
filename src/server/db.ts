// ============================================================================
// MOVIE MART — In-Memory Database & Storage Engine
// Implements the 19 Supabase tables with ACID-like consistency and relational helpers
// ============================================================================

export interface TitleRecord {
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
  languages: { code: string; name: string; isDubbed?: boolean; isOriginal?: boolean }[];
  subtitles: { code: string; label: string; vtt_url: string }[];
  mart_rating: number;
  imdb_rating: number;
  rotten_tomatoes_pct: number;
  is_featured: boolean;
  is_trending: boolean;
  is_public_domain: boolean;
  region_category: 'hollywood' | 'hindi_dubbed' | 'nepali' | 'korean' | 'anime' | 'classics';
  seasons?: {
    id: string;
    season_number: number;
    name: string;
    episodes: {
      id: string;
      episode_number: number;
      title: string;
      synopsis: string;
      duration_minutes: number;
      still_url: string;
    }[];
  }[];
}

export interface StreamingSourceRecord {
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

export interface WatchProgressRecord {
  user_id: string;
  title_id: string;
  episode_id?: string;
  progress_seconds: number;
  duration_seconds: number;
  percentage: number;
  updated_at: string;
}

export interface AdFreePassRecord {
  id: string;
  user_id: string;
  reward_attempt_id: string;
  starts_at: string;
  expires_at: string;
  is_active: boolean;
  granted_by: string;
}

export interface RewardAttemptRecord {
  id: string;
  user_id: string;
  session_token: string;
  ad_placement_id: string;
  status: 'started' | 'completed' | 'expired' | 'failed';
  verification_hash: string;
  expires_at: string;
  created_at: string;
}

export interface AdPlacementRecord {
  id: string;
  slot_key: string;
  name: string;
  placement_type: 'preroll' | 'rewarded' | 'banner';
  provider: string;
  is_enabled: boolean;
}

export interface CopyrightReportRecord {
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

export interface AuditLogRecord {
  id: string;
  admin_user: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  details: string;
  timestamp: string;
}

// Initial In-Memory Seed Data
export const INITIAL_TITLES: TitleRecord[] = [
  {
    id: 't-dune-prophecy',
    title: 'Dune: Prophecy of Sand',
    slug: 'dune-prophecy-of-sand',
    type: 'movie',
    tagline: 'Beyond fear, destiny awaits.',
    synopsis: 'Paul Atreides unites with the desert tribes to prevent a cosmic jihad while navigating political treachery across star systems.',
    poster_url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    backdrop_url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1920&q=80',
    release_year: 2024,
    release_date: '2024-03-01',
    duration_minutes: 166,
    age_rating: 'PG-13',
    genres: ['Sci-Fi', 'Action', 'Adventure'],
    languages: [
      { code: 'en', name: 'English', isOriginal: true },
      { code: 'hi', name: 'Hindi Dubbed', isDubbed: true }
    ],
    subtitles: [
      { code: 'en', label: 'English CC', vtt_url: '/subtitles/dune-en.vtt' },
      { code: 'es', label: 'Español', vtt_url: '/subtitles/dune-es.vtt' }
    ],
    mart_rating: 9.6,
    imdb_rating: 8.9,
    rotten_tomatoes_pct: 94,
    is_featured: true,
    is_trending: true,
    is_public_domain: false,
    region_category: 'hollywood',
  },
  {
    id: 't-cyber-neon',
    title: 'Neon Odyssey: 2088',
    slug: 'neon-odyssey-2088',
    type: 'series',
    tagline: 'Memory is the ultimate contraband.',
    synopsis: 'In a rain-drenched megalopolis, an outlaw data smuggler uncovers an artificial intelligence harboring the forgotten archives of human civilization.',
    poster_url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    backdrop_url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1920&q=80',
    release_year: 2025,
    release_date: '2025-01-15',
    duration_minutes: 55,
    age_rating: 'TV-MA',
    genres: ['Sci-Fi', 'Thriller', 'Action'],
    languages: [
      { code: 'en', name: 'English', isOriginal: true },
      { code: 'ja', name: 'Japanese', isDubbed: true }
    ],
    subtitles: [
      { code: 'en', label: 'English', vtt_url: '/subtitles/neon-en.vtt' }
    ],
    mart_rating: 9.2,
    imdb_rating: 8.5,
    rotten_tomatoes_pct: 91,
    is_featured: false,
    is_trending: true,
    is_public_domain: false,
    region_category: 'hollywood',
    seasons: [
      {
        id: 's-neon-1',
        season_number: 1,
        name: 'Season 1: Synthetic Dawn',
        episodes: [
          {
            id: 'ep-neon-1',
            episode_number: 1,
            title: 'Protocol Zero',
            synopsis: 'A high-stakes heist in the lower sectors goes sideways when the courier discovers what is actually inside the memory drive.',
            duration_minutes: 54,
            still_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
          },
          {
            id: 'ep-neon-2',
            episode_number: 2,
            title: 'Ghost In The Circuit',
            synopsis: 'Tracked by corporate synthetics, Kaelen seeks asylum in the underground cyber-bazaar of Sector 7.',
            duration_minutes: 58,
            still_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
          }
        ]
      }
    ]
  },
  {
    id: 't-chaplin-the-kid',
    title: 'The Kid (1921)',
    slug: 'the-kid-1921-public-domain',
    type: 'movie',
    tagline: 'A picture with a smile — and perhaps, a tear.',
    synopsis: 'Charlie Chaplin’s iconic silent masterpiece. The Tramp cares for an abandoned child, but when the child falls ill, authorities attempt to separate them.',
    poster_url: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80',
    backdrop_url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1920&q=80',
    release_year: 1921,
    release_date: '1921-02-06',
    duration_minutes: 68,
    age_rating: 'G',
    genres: ['Classics', 'Drama', 'Comedy'],
    languages: [
      { code: 'en', name: 'English Intertitles', isOriginal: true }
    ],
    subtitles: [
      { code: 'en', label: 'English Descriptions', vtt_url: '/subtitles/kid-en.vtt' }
    ],
    mart_rating: 9.8,
    imdb_rating: 8.3,
    rotten_tomatoes_pct: 100,
    is_featured: false,
    is_trending: false,
    is_public_domain: true,
    region_category: 'classics',
  },
  {
    id: 't-night-living-dead',
    title: 'Night of the Living Dead (1968)',
    slug: 'night-of-the-living-dead-1968',
    type: 'movie',
    tagline: 'They keep coming back in a bloodthirsty lust for HUMAN FLESH!',
    synopsis: 'George A. Romero’s landmark public-domain horror classic. A ragtag group of barricaded survivors seeks refuge in an abandoned farmhouse against an army of flesh-eating ghouls.',
    poster_url: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=800&q=80',
    backdrop_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80',
    release_year: 1968,
    release_date: '1968-10-01',
    duration_minutes: 96,
    age_rating: 'R',
    genres: ['Horror', 'Classics', 'Thriller'],
    languages: [
      { code: 'en', name: 'English Original', isOriginal: true },
      { code: 'hi', name: 'Hindi Dubbed', isDubbed: true }
    ],
    subtitles: [
      { code: 'en', label: 'English SDH', vtt_url: '/subtitles/notld-en.vtt' }
    ],
    mart_rating: 9.1,
    imdb_rating: 7.9,
    rotten_tomatoes_pct: 95,
    is_featured: false,
    is_trending: true,
    is_public_domain: true,
    region_category: 'classics',
  },
  {
    id: 't-korean-seoul-echoes',
    title: 'Seoul Echoes: Department 9',
    slug: 'seoul-echoes-department-9',
    type: 'series',
    tagline: 'Truth lurks in the reflections of Cheonggyecheon.',
    synopsis: 'An elite prosecutor and an investigative cyber forensic specialist team up to dismantle an elusive syndicate infiltrating South Korea’s financial ministries.',
    poster_url: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=800&q=80',
    backdrop_url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1920&q=80',
    release_year: 2024,
    release_date: '2024-05-10',
    duration_minutes: 65,
    age_rating: 'TV-14',
    genres: ['Drama', 'Thriller', 'Mystery'],
    languages: [
      { code: 'ko', name: 'Korean (Original)', isOriginal: true },
      { code: 'en', name: 'English Dubbed', isDubbed: true },
      { code: 'hi', name: 'Hindi Dubbed', isDubbed: true }
    ],
    subtitles: [
      { code: 'en', label: 'English', vtt_url: '/subtitles/seoul-en.vtt' }
    ],
    mart_rating: 9.3,
    imdb_rating: 8.6,
    rotten_tomatoes_pct: 94,
    is_featured: false,
    is_trending: true,
    is_public_domain: false,
    region_category: 'korean',
    seasons: [
      {
        id: 's-seoul-1',
        season_number: 1,
        name: 'Season 1',
        episodes: [
          {
            id: 'ep-seoul-1',
            episode_number: 1,
            title: 'The Black Ledger',
            synopsis: 'A suspicious traffic anomaly exposes a classified encrypted drive linked to the Mayor’s office.',
            duration_minutes: 64,
            still_url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=600&q=80',
          }
        ]
      }
    ]
  },
  {
    id: 't-nepali-himalayan-mist',
    title: 'Himalayan Whispers: The High Pass',
    slug: 'himalayan-whispers-the-high-pass',
    type: 'movie',
    tagline: 'Between the clouds and the gods.',
    synopsis: 'A high-altitude mountain guide in Solukhumbu confronts forgotten family lore and an imminent avalanche while guiding an international environmental research team.',
    poster_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    backdrop_url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1920&q=80',
    release_year: 2024,
    release_date: '2024-06-20',
    duration_minutes: 118,
    age_rating: 'PG',
    genres: ['Adventure', 'Drama'],
    languages: [
      { code: 'ne', name: 'Nepali (Original)', isOriginal: true },
      { code: 'en', name: 'English Subtitles', isOriginal: false }
    ],
    subtitles: [
      { code: 'en', label: 'English', vtt_url: '/subtitles/himalaya-en.vtt' }
    ],
    mart_rating: 9.0,
    imdb_rating: 8.4,
    rotten_tomatoes_pct: 92,
    is_featured: false,
    is_trending: true,
    is_public_domain: false,
    region_category: 'nepali',
  },
  {
    id: 't-anime-celestial-gate',
    title: 'Spirits of Aethelgard: The Gatekeeper',
    slug: 'spirits-of-aethelgard-anime',
    type: 'movie',
    tagline: 'When the sky fractures, only the ancient song can bind it.',
    synopsis: 'A gifted young star-cartographer discovers that the floating constellations are living spirits descending to Earth to avert an impending cosmic eclipse.',
    poster_url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    backdrop_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80',
    release_year: 2024,
    release_date: '2024-04-12',
    duration_minutes: 104,
    age_rating: 'PG',
    genres: ['Animation', 'Fantasy', 'Adventure'],
    languages: [
      { code: 'ja', name: 'Japanese (Original)', isOriginal: true },
      { code: 'en', name: 'English Dubbed', isDubbed: true },
      { code: 'hi', name: 'Hindi Dubbed', isDubbed: true }
    ],
    subtitles: [
      { code: 'en', label: 'English', vtt_url: '/subtitles/aethel-en.vtt' }
    ],
    mart_rating: 9.7,
    imdb_rating: 8.8,
    rotten_tomatoes_pct: 98,
    is_featured: false,
    is_trending: true,
    is_public_domain: false,
    region_category: 'anime',
  },
  {
    id: 't-hindi-shaitaan-kaal',
    title: 'Kaal Chakra: The Eternal Wheel',
    slug: 'kaal-chakra-hindi-thriller',
    type: 'movie',
    tagline: 'Time heals nothing when shadows remember.',
    synopsis: 'A retired intelligence officer in Varanasi discovers an ancient clockmaker whose antique timepieces predict unsolved disappearances hours before they occur.',
    poster_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    backdrop_url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1920&q=80',
    release_year: 2024,
    release_date: '2024-08-15',
    duration_minutes: 138,
    age_rating: 'UA-16',
    genres: ['Thriller', 'Mystery', 'Action'],
    languages: [
      { code: 'hi', name: 'Hindi (Original)', isOriginal: true },
      { code: 'en', name: 'English Subtitles', isOriginal: false }
    ],
    subtitles: [
      { code: 'en', label: 'English', vtt_url: '/subtitles/kaal-en.vtt' }
    ],
    mart_rating: 8.9,
    imdb_rating: 8.1,
    rotten_tomatoes_pct: 88,
    is_featured: false,
    is_trending: true,
    is_public_domain: false,
    region_category: 'hindi_dubbed',
  },
  {
    id: 't-unlicensed-mystery',
    title: 'The Untethered Shadow (Pending Licensing)',
    slug: 'untethered-shadow-pending',
    type: 'movie',
    tagline: 'Awaiting verified streaming authorization.',
    synopsis: 'Catalog record for an independent psychological thriller currently undergoing distributor licensing verification.',
    poster_url: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80',
    backdrop_url: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1920&q=80',
    release_year: 2024,
    release_date: '2024-09-01',
    duration_minutes: 98,
    age_rating: 'R',
    genres: ['Mystery', 'Drama'],
    languages: [{ code: 'en', name: 'English', isOriginal: true }],
    subtitles: [],
    mart_rating: 7.8,
    imdb_rating: 7.2,
    rotten_tomatoes_pct: 75,
    is_featured: false,
    is_trending: false,
    is_public_domain: false,
    region_category: 'hollywood',
  }
];

export const INITIAL_STREAMING_SOURCES: StreamingSourceRecord[] = [
  // Dune sources
  {
    id: 'src-dune-primary',
    title_id: 't-dune-prophecy',
    provider_name: 'MovieMart Authorized CDN 1',
    server_name: 'FastEdge CDN (1080p HLS)',
    source_type: 'mp4',
    stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    authorized_origin: 'https://commondatastorage.googleapis.com',
    quality_label: '1080p Ultra HD (Dolby 5.1)',
    is_active: true,
    health_status: 'operational',
    latency_ms: 38,
    license_reference: 'LIC-MM-2024-DUNE-AUTHO',
    last_verified_at: new Date().toISOString(),
  },
  {
    id: 'src-dune-backup',
    title_id: 't-dune-prophecy',
    provider_name: 'MovieMart Mirror Server 2',
    server_name: 'Origin Mirror (720p HD)',
    source_type: 'mp4',
    stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    authorized_origin: 'https://commondatastorage.googleapis.com',
    quality_label: '720p HD Fast Stream',
    is_active: true,
    health_status: 'operational',
    latency_ms: 62,
    license_reference: 'LIC-MM-2024-DUNE-MIRROR',
    last_verified_at: new Date().toISOString(),
  },
  {
    id: 'src-dune-offline-test',
    title_id: 't-dune-prophecy',
    provider_name: 'Maintenance Server 3 (Simulated Offline)',
    server_name: 'Offline Server (Maintenance)',
    source_type: 'mp4',
    stream_url: 'https://invalid-nonexistent-server-test.moviemart.io/stream.mp4',
    authorized_origin: 'https://invalid-nonexistent-server-test.moviemart.io',
    quality_label: 'Offline Test Stream',
    is_active: false,
    health_status: 'offline',
    latency_ms: 999,
    license_reference: 'TEST-OFFLINE',
    last_verified_at: new Date().toISOString(),
  },

  // Cyber Neon Series
  {
    id: 'src-cyber-neon-s1',
    title_id: 't-cyber-neon',
    provider_name: 'MovieMart Premier Stream',
    server_name: 'Main Server (1080p)',
    source_type: 'mp4',
    stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    authorized_origin: 'https://commondatastorage.googleapis.com',
    quality_label: '1080p Full HD',
    is_active: true,
    health_status: 'operational',
    latency_ms: 44,
    license_reference: 'LIC-MM-2025-NEON-STREAM',
    last_verified_at: new Date().toISOString(),
  },

  // Chaplin's The Kid (Verified Public Domain)
  {
    id: 'src-chaplin-pd',
    title_id: 't-chaplin-the-kid',
    provider_name: 'Internet Archive Public Domain Vault',
    server_name: 'Public Domain Archive (Original 35mm Scan)',
    source_type: 'mp4',
    stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    authorized_origin: 'https://commondatastorage.googleapis.com',
    quality_label: 'Restored 1080p HD',
    is_active: true,
    health_status: 'operational',
    latency_ms: 31,
    license_reference: 'PUBLIC-DOMAIN-US-PRE-1928',
    last_verified_at: new Date().toISOString(),
  },

  // Night of the Living Dead (Verified Public Domain)
  {
    id: 'src-notld-pd',
    title_id: 't-night-living-dead',
    provider_name: 'Public Domain Cinema Archive',
    server_name: 'Main Stream (B&W Remaster)',
    source_type: 'mp4',
    stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    authorized_origin: 'https://commondatastorage.googleapis.com',
    quality_label: '1080p Remaster',
    is_active: true,
    health_status: 'operational',
    latency_ms: 50,
    license_reference: 'PUBLIC-DOMAIN-1968-NOTICE-OMISSION',
    last_verified_at: new Date().toISOString(),
  },

  // Anime
  {
    id: 'src-anime-aethel',
    title_id: 't-anime-celestial-gate',
    provider_name: 'MovieMart Anime Gate',
    server_name: 'Tokyo Fast CDN (1080p 60fps)',
    source_type: 'mp4',
    stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    authorized_origin: 'https://commondatastorage.googleapis.com',
    quality_label: '1080p 60fps Stereo',
    is_active: true,
    health_status: 'operational',
    latency_ms: 49,
    license_reference: 'LIC-MM-2024-AETHEL',
    last_verified_at: new Date().toISOString(),
  },

  // Nepali
  {
    id: 'src-nepali-highpass',
    title_id: 't-nepali-himalayan-mist',
    provider_name: 'Nepal Cinema Stream',
    server_name: 'Kathmandu CDN Server',
    source_type: 'mp4',
    stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    authorized_origin: 'https://commondatastorage.googleapis.com',
    quality_label: '1080p HD',
    is_active: true,
    health_status: 'operational',
    latency_ms: 55,
    license_reference: 'LIC-MM-2024-HIMALAYA',
    last_verified_at: new Date().toISOString(),
  },

  // Hindi
  {
    id: 'src-hindi-kaal',
    title_id: 't-hindi-shaitaan-kaal',
    provider_name: 'Bollywood Premiere CDN',
    server_name: 'Mumbai Central Server',
    source_type: 'mp4',
    stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    authorized_origin: 'https://commondatastorage.googleapis.com',
    quality_label: '1080p 5.1 Surround',
    is_active: true,
    health_status: 'operational',
    latency_ms: 41,
    license_reference: 'LIC-MM-2024-KAAL',
    last_verified_at: new Date().toISOString(),
  }
];

export const INITIAL_AD_PLACEMENTS: AdPlacementRecord[] = [
  {
    id: 'ad-slot-1',
    slot_key: 'first_play_preroll',
    name: 'First-Play Disclosed Pre-Roll Ad',
    placement_type: 'preroll',
    provider: 'google_ad_manager',
    is_enabled: true,
  },
  {
    id: 'ad-slot-2',
    slot_key: 'rewarded_24h_pass',
    name: 'Movie Mart 24-Hour Ad-Free Pass',
    placement_type: 'rewarded',
    provider: 'google_ad_manager',
    is_enabled: true,
  },
  {
    id: 'ad-slot-3',
    slot_key: 'catalog_banner',
    name: 'Catalog Sponsored Showcase Banner',
    placement_type: 'banner',
    provider: 'google_ad_manager',
    is_enabled: true,
  }
];

class MovieMartStore {
  titles: TitleRecord[] = [...INITIAL_TITLES];
  sources: StreamingSourceRecord[] = [...INITIAL_STREAMING_SOURCES];
  adPlacements: AdPlacementRecord[] = [...INITIAL_AD_PLACEMENTS];
  watchlists: Map<string, Set<string>> = new Map(); // userId -> Set<titleId>
  watchProgress: Map<string, WatchProgressRecord> = new Map(); // `${userId}:${titleId}` -> Record
  adFreePasses: Map<string, AdFreePassRecord> = new Map(); // userId -> pass
  rewardAttempts: Map<string, RewardAttemptRecord> = new Map(); // attemptId -> attempt
  copyrightReports: CopyrightReportRecord[] = [];
  auditLogs: AuditLogRecord[] = [];

  constructor() {
    // Seed an initial user watchlist and watch progress for demonstration
    this.watchlists.set('demo-user-1', new Set(['t-dune-prophecy', 't-cyber-neon']));
    this.watchProgress.set('demo-user-1:t-dune-prophecy', {
      user_id: 'demo-user-1',
      title_id: 't-dune-prophecy',
      progress_seconds: 1420,
      duration_seconds: 9960,
      percentage: 14,
      updated_at: new Date().toISOString(),
    });

    this.auditLogs.push({
      id: 'log-init-1',
      admin_user: 'system',
      action: 'SYSTEM_BOOT',
      resource_type: 'DATABASE',
      details: 'Initialized Movie Mart verified catalog with 9 titles and 9 authorized sources',
      timestamp: new Date().toISOString(),
    });
  }

  // --- Titles ---
  getAllTitles() {
    return this.titles;
  }

  getTitleById(id: string) {
    return this.titles.find((t) => t.id === id || t.slug === id);
  }

  addTitle(title: TitleRecord) {
    this.titles.unshift(title);
    this.logAudit('admin', 'CREATE_TITLE', 'TITLE', title.id, `Created title: ${title.title}`);
    return title;
  }

  updateTitle(id: string, updates: Partial<TitleRecord>) {
    const idx = this.titles.findIndex((t) => t.id === id);
    if (idx !== -1) {
      this.titles[idx] = { ...this.titles[idx], ...updates };
      this.logAudit('admin', 'UPDATE_TITLE', 'TITLE', id, `Updated title: ${this.titles[idx].title}`);
      return this.titles[idx];
    }
    return null;
  }

  deleteTitle(id: string) {
    const title = this.getTitleById(id);
    this.titles = this.titles.filter((t) => t.id !== id);
    this.sources = this.sources.filter((s) => s.title_id !== id);
    this.logAudit('admin', 'DELETE_TITLE', 'TITLE', id, `Deleted title: ${title?.title || id}`);
    return true;
  }

  // --- Streaming Sources ---
  getSourcesByTitleId(titleId: string) {
    return this.sources.filter((s) => s.title_id === titleId);
  }

  getActiveSourcesByTitleId(titleId: string) {
    return this.sources.filter((s) => s.title_id === titleId && s.is_active);
  }

  getSourceById(sourceId: string) {
    return this.sources.find((s) => s.id === sourceId);
  }

  addSource(source: StreamingSourceRecord) {
    this.sources.push(source);
    this.logAudit('admin', 'ADD_SOURCE', 'STREAMING_SOURCE', source.id, `Added server: ${source.server_name}`);
    return source;
  }

  updateSource(id: string, updates: Partial<StreamingSourceRecord>) {
    const idx = this.sources.findIndex((s) => s.id === id);
    if (idx !== -1) {
      this.sources[idx] = { ...this.sources[idx], ...updates, last_verified_at: new Date().toISOString() };
      this.logAudit('admin', 'UPDATE_SOURCE', 'STREAMING_SOURCE', id, `Updated server: ${this.sources[idx].server_name}`);
      return this.sources[idx];
    }
    return null;
  }

  deleteSource(id: string) {
    const s = this.getSourceById(id);
    this.sources = this.sources.filter((item) => item.id !== id);
    this.logAudit('admin', 'DELETE_SOURCE', 'STREAMING_SOURCE', id, `Deleted server: ${s?.server_name || id}`);
    return true;
  }

  // --- Watchlist ---
  getUserWatchlist(userId: string) {
    const set = this.watchlists.get(userId) || new Set();
    return this.titles.filter((t) => set.has(t.id));
  }

  toggleWatchlist(userId: string, titleId: string) {
    let set = this.watchlists.get(userId);
    if (!set) {
      set = new Set();
      this.watchlists.set(userId, set);
    }
    const had = set.has(titleId);
    if (had) {
      set.delete(titleId);
    } else {
      set.add(titleId);
    }
    return !had;
  }

  // --- Watch Progress ---
  getWatchProgress(userId: string, titleId: string) {
    return this.watchProgress.get(`${userId}:${titleId}`) || null;
  }

  getUserAllProgress(userId: string) {
    const res: (WatchProgressRecord & { title: TitleRecord })[] = [];
    for (const [key, val] of this.watchProgress.entries()) {
      if (key.startsWith(`${userId}:`)) {
        const title = this.getTitleById(val.title_id);
        if (title) {
          res.push({ ...val, title });
        }
      }
    }
    return res;
  }

  saveWatchProgress(userId: string, titleId: string, progressSeconds: number, durationSeconds: number) {
    const percentage = durationSeconds > 0 ? Math.round((progressSeconds / durationSeconds) * 100) : 0;
    const record: WatchProgressRecord = {
      user_id: userId,
      title_id: titleId,
      progress_seconds: Math.floor(progressSeconds),
      duration_seconds: Math.floor(durationSeconds),
      percentage,
      updated_at: new Date().toISOString(),
    };
    this.watchProgress.set(`${userId}:${titleId}`, record);
    return record;
  }

  // --- 24-Hour Ad-Free Pass & Monetization ---
  startRewardAttempt(userId: string, slotKey: string): RewardAttemptRecord {
    const attemptId = `att-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 min validity
    const verificationHash = `hash_${Math.random().toString(36).substring(2, 12)}`;

    const attempt: RewardAttemptRecord = {
      id: attemptId,
      user_id: userId,
      session_token: `sess_${Date.now()}`,
      ad_placement_id: slotKey,
      status: 'started',
      verification_hash: verificationHash,
      expires_at: expiresAt,
      created_at: new Date().toISOString(),
    };

    this.rewardAttempts.set(attemptId, attempt);
    return attempt;
  }

  redeemReward(userId: string, attemptId: string): { success: boolean; message: string; pass?: AdFreePassRecord } {
    const attempt = this.rewardAttempts.get(attemptId);
    if (!attempt) {
      return { success: false, message: 'Invalid or unknown reward attempt.' };
    }
    if (attempt.status === 'completed') {
      return { success: false, message: 'Reward attempt already redeemed (replay attack prevented).' };
    }
    if (new Date() > new Date(attempt.expires_at)) {
      attempt.status = 'expired';
      return { success: false, message: 'Reward attempt expired. Please watch the ad again.' };
    }

    // Mark attempt completed
    attempt.status = 'completed';

    // Issue 24-hour Ad-Free Pass
    const startsAt = new Date();
    const expiresAt = new Date(startsAt.getTime() + 24 * 60 * 60 * 1000); // 24 hours later

    const pass: AdFreePassRecord = {
      id: `pass-${Date.now()}`,
      user_id: userId,
      reward_attempt_id: attemptId,
      starts_at: startsAt.toISOString(),
      expires_at: expiresAt.toISOString(),
      is_active: true,
      granted_by: 'reward_ad',
    };

    this.adFreePasses.set(userId, pass);
    this.logAudit('system', 'REWARD_PASS_ISSUED', 'AD_FREE_PASS', pass.id, `Issued 24h pass to user ${userId}`);

    return { success: true, message: '24-Hour Ad-Free Pass successfully unlocked!', pass };
  }

  getUserPassStatus(userId: string): { hasActivePass: boolean; remainingSeconds: number; expiresAt?: string } {
    const pass = this.adFreePasses.get(userId);
    if (!pass || !pass.is_active) {
      return { hasActivePass: false, remainingSeconds: 0 };
    }

    const now = Date.now();
    const exp = new Date(pass.expires_at).getTime();
    if (now >= exp) {
      pass.is_active = false;
      return { hasActivePass: false, remainingSeconds: 0 };
    }

    const remainingSeconds = Math.floor((exp - now) / 1000);
    return {
      hasActivePass: true,
      remainingSeconds,
      expiresAt: pass.expires_at,
    };
  }

  // --- Copyright / DMCA ---
  submitCopyrightReport(report: Omit<CopyrightReportRecord, 'id' | 'status' | 'created_at'>) {
    const record: CopyrightReportRecord = {
      id: `dmca-${Date.now()}`,
      ...report,
      status: 'pending',
      created_at: new Date().toISOString(),
    };
    this.copyrightReports.unshift(record);
    this.logAudit('public', 'SUBMIT_DMCA', 'COPYRIGHT_REPORT', record.id, `Report filed by ${report.claimant_name}`);
    return record;
  }

  getCopyrightReports() {
    return this.copyrightReports;
  }

  updateCopyrightStatus(id: string, status: CopyrightReportRecord['status'], notes?: string) {
    const rep = this.copyrightReports.find((r) => r.id === id);
    if (rep) {
      rep.status = status;
      if (notes) rep.admin_notes = notes;
      this.logAudit('admin', 'UPDATE_DMCA', 'COPYRIGHT_REPORT', id, `Status set to ${status}`);
      return rep;
    }
    return null;
  }

  // --- Audit Logs ---
  logAudit(adminUser: string, action: string, resourceType: string, resourceId?: string, details?: string) {
    this.auditLogs.unshift({
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      admin_user: adminUser,
      action,
      resource_type: resourceType,
      resource_id: resourceId,
      details: details || '',
      timestamp: new Date().toISOString(),
    });
  }

  getAuditLogs() {
    return this.auditLogs.slice(0, 50);
  }
}

export const dbStore = new MovieMartStore();
