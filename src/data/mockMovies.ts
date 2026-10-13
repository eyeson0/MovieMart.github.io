import { Movie, SnackItem } from '../types/movie';

export const SNACKS_MENU: SnackItem[] = [
  {
    id: 'snack-1',
    name: 'Artisan Warm Truffle Popcorn',
    description: 'Fresh popped in coconut oil, dusted with black summer truffle & sea salt',
    price: 9.50,
    image: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=600&q=80',
    category: 'popcorn',
  },
  {
    id: 'snack-2',
    name: 'Sweet Caramel Crunch Tub',
    description: 'Crispy caramelized glazed popcorn with roasted sea-salt pecans',
    price: 8.75,
    image: 'https://images.unsplash.com/photo-1512149177596-f817c7ef5d4c?auto=format&fit=crop&w=600&q=80',
    category: 'popcorn',
  },
  {
    id: 'snack-3',
    name: 'Gourmet Loaded Queso Nachos',
    description: 'Crispy stone-ground tortilla chips, smoked jalapeño cheese, pico & guacamole',
    price: 11.00,
    image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=600&q=80',
    category: 'combos',
  },
  {
    id: 'snack-4',
    name: 'MovieMart VIP Duo Combo',
    description: '1 Large Popcorn, 2 Craft Sodas & choice of gourmet candy box',
    price: 18.50,
    image: 'https://images.unsplash.com/photo-1585647347384-2593bc35786b?auto=format&fit=crop&w=600&q=80',
    category: 'combos',
  },
  {
    id: 'snack-5',
    name: 'Fountain Craft Soda (32oz)',
    description: 'Cola, Cherry Vanilla, Sparkling Lemon-Lime or Craft Root Beer',
    price: 5.50,
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80',
    category: 'drink',
  },
  {
    id: 'snack-6',
    name: 'Dark Chocolate Sea Salt Bites',
    description: 'Handcrafted 72% Belgian dark chocolate drops filled with salted caramel',
    price: 6.50,
    image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=600&q=80',
    category: 'sweets',
  }
];

export const MOCK_MOVIES: Movie[] = [
  {
    id: 'dune-part-two',
    title: 'Dune: Prophecy of Sand',
    tagline: 'Long live the fighters.',
    synopsis: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he endeavors to prevent a catastrophic future.',
    poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    backdrop: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1920&q=80',
    year: 2024,
    ageRating: 'PG-13',
    duration: '2h 46m',
    genres: ['Sci-Fi', 'Adventure', 'Drama', 'Action'],
    director: 'Denis Villeneuve',
    cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson', 'Javier Bardem', 'Austin Butler'],
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    martRating: 9.6,
    imdbRating: 8.9,
    rottenTomatoes: 94,
    digitalBuyPrice: 22.99,
    digitalRentPrice: 6.99,
    hasTheater: true,
    theaterTicketPrice: 16.50,
    theatersAvailable: ['IMAX Laser Dome - Grand Central', 'Dolby Cinema 8 - Metropolis', 'Starlight Luxe Suites'],
    specs: {
      resolution: '4K Ultra HD HDR',
      audio: 'Dolby Atmos 7.1.4 Surround',
      hdr: 'Dolby Vision & HDR10+',
      aspectRatio: '1.43:1 IMAX Expanded',
    },
    featured: true,
    isTrending: true,
    isNewRelease: true,
    isTopMart: true,
    reviews: [
      {
        id: 'rev-1',
        author: 'Marcus Vance',
        rating: 5,
        date: '2 days ago',
        comment: 'A visual and sonic masterclass. The scale of the desert worms in 4K HDR at home was exhilarating.',
        likes: 142
      },
      {
        id: 'rev-2',
        author: 'Elena Rostova',
        rating: 5,
        date: '1 week ago',
        comment: 'Pure cinematic poetry. The sound design shakes the foundations. Must-watch on the biggest screen.',
        likes: 89
      }
    ],
    merchandise: [
      {
        id: 'merch-dune-steelbook',
        movieId: 'dune-part-two',
        name: 'Collector’s Golden Foil 4K UHD Steelbook Edition',
        description: 'Embossed sand-gold slipcase with 32-page concept art booklet and numbered lithograph.',
        price: 49.99,
        image: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=600&q=80',
        badge: 'Limited Run of 500',
        inStock: true
      },
      {
        id: 'merch-dune-vinyl',
        movieId: 'dune-part-two',
        name: 'Original Orchestral Motion Picture Score 2xLP Vinyl',
        description: 'Pressed on sand-swirl 180g heavyweight audiophile vinyl featuring Hans Zimmer score.',
        price: 38.00,
        image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=600&q=80',
        badge: 'Audiophile Edition',
        inStock: true
      }
    ]
  },
  {
    id: 'cyber-neon-2088',
    title: 'Neon Odyssey: 2088',
    tagline: 'Memory is the ultimate contraband.',
    synopsis: 'In a rain-drenched megalopolis where memories are traded like cryptocurrency, a renegade data retriever discovers a synthetic consciousness that holds the key to human immortality, hunted by corporate assassins.',
    poster: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    backdrop: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1920&q=80',
    year: 2025,
    ageRating: 'R',
    duration: '2h 18m',
    genres: ['Sci-Fi', 'Cyberpunk', 'Thriller', 'Action'],
    director: 'Kaelen Thorne',
    cast: ['Alex Ren', 'Maya Sterling', 'Hiroyuki Sanada', 'Gemma Chan'],
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    martRating: 9.2,
    imdbRating: 8.4,
    rottenTomatoes: 91,
    digitalBuyPrice: 19.99,
    digitalRentPrice: 5.99,
    hasTheater: true,
    theaterTicketPrice: 15.00,
    theatersAvailable: ['Dolby Cinema 8 - Metropolis', 'CyberPlex Laser Theater'],
    specs: {
      resolution: '4K Ultra HD',
      audio: 'Dolby Atmos Spatial Audio',
      hdr: 'Dolby Vision',
      aspectRatio: '2.39:1 Anamorphic',
    },
    featured: false,
    isTrending: true,
    isNewRelease: true,
    reviews: [
      {
        id: 'rev-3',
        author: 'Sora Tanaka',
        rating: 5,
        date: 'Yesterday',
        comment: 'Blade Runner meets Ghost in the Shell. The synth soundtrack alone is worth purchasing the 4K edition!',
        likes: 64
      }
    ],
    merchandise: [
      {
        id: 'merch-neon-jacket',
        movieId: 'cyber-neon-2088',
        name: 'Cybernetic Syndicate Bomber Jacket (Replica)',
        description: 'Waterproof techwear fabric with luminescent fiber-optic collar accents.',
        price: 129.99,
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80',
        badge: 'Official Prop Replica',
        inStock: true
      }
    ]
  },
  {
    id: 'chronicles-of-elysium',
    title: 'Chronicles of Elysium',
    tagline: 'Beyond the edge of known starlight.',
    synopsis: 'An interstellar exploration crew sent to inspect a mysterious megastructure at the boundary of our solar system realizes it operates as a cosmic prism, bending spacetime and confronting them with parallel realities of their own pasts.',
    poster: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    backdrop: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1920&q=80',
    year: 2024,
    ageRating: 'PG-13',
    duration: '2h 35m',
    genres: ['Sci-Fi', 'Mystery', 'Adventure'],
    director: 'Claire Fontaine',
    cast: ['Christian Bale', 'Cynthia Erivo', 'Stellan Skarsgård'],
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    martRating: 9.5,
    imdbRating: 8.7,
    rottenTomatoes: 96,
    digitalBuyPrice: 21.99,
    digitalRentPrice: 6.49,
    hasTheater: false,
    specs: {
      resolution: '4K Native UHD Master',
      audio: 'DTS:X / Dolby Atmos 9.1',
      hdr: 'HDR10+ & Dolby Vision',
      aspectRatio: '2.20:1 70mm Format',
    },
    featured: false,
    isTrending: false,
    isNewRelease: false,
    isTopMart: true,
    reviews: [
      {
        id: 'rev-4',
        author: 'Dr. Liam H.',
        rating: 5,
        date: '3 weeks ago',
        comment: 'Mind-bending science-fiction that respects the audience. The deep space visuals are staggering.',
        likes: 112
      }
    ]
  },
  {
    id: 'midnight-in-kyoto',
    title: 'Midnight in Kyoto',
    tagline: 'Every lantern holds a secret.',
    synopsis: 'A disillusioned jazz pianist takes a residency at a hidden underground bar in the historic Gion district of Kyoto, only to stumble upon an unsolved mystery linking four generations of local artisan families.',
    poster: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
    backdrop: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1920&q=80',
    year: 2024,
    ageRating: 'PG',
    duration: '1h 56m',
    genres: ['Drama', 'Romance', 'Music'],
    director: 'Kenji Mizoguchi Jr.',
    cast: ['Ryosuke Yamada', 'Rinko Kikuchi', 'Ethan Hawke'],
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    martRating: 8.9,
    imdbRating: 8.2,
    rottenTomatoes: 95,
    digitalBuyPrice: 16.99,
    digitalRentPrice: 4.99,
    hasTheater: true,
    theaterTicketPrice: 13.50,
    theatersAvailable: ['Indie Cinema House', 'Starlight Luxe Suites'],
    specs: {
      resolution: '4K Ultra HD',
      audio: 'Dolby Atmos Lossless Hi-Fi',
      hdr: 'HDR10',
      aspectRatio: '1.85:1 European Widescreen',
    },
    featured: false,
    isTrending: false,
    isNewRelease: true,
    reviews: [
      {
        id: 'rev-5',
        author: 'Sophie Martin',
        rating: 5,
        date: '4 days ago',
        comment: 'The music alone brought tears to my eyes. Beautiful, gentle, deeply moving film.',
        likes: 47
      }
    ]
  },
  {
    id: 'shadow-of-the-valkyrie',
    title: 'Shadow of the Valkyrie',
    tagline: 'When the gods fall, mortals forge their own destiny.',
    synopsis: 'In tenth-century Scandinavia, an exiled shield-maiden discovers an ancient runestone cursed with the wrath of forgotten Norse deities. To save her village from eternal winter, she must journey through the mist-shrouded peaks of Jotunheim.',
    poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    backdrop: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80',
    year: 2024,
    ageRating: 'R',
    duration: '2h 22m',
    genres: ['Action', 'Fantasy', 'History', 'Adventure'],
    director: 'Astrid Lind',
    cast: ['Katheryn Winnick', 'Alexander Skarsgård', 'Mads Mikkelsen'],
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    martRating: 9.1,
    imdbRating: 8.5,
    rottenTomatoes: 89,
    digitalBuyPrice: 18.99,
    digitalRentPrice: 5.49,
    hasTheater: true,
    theaterTicketPrice: 15.50,
    theatersAvailable: ['IMAX Laser Dome - Grand Central', 'Dolby Cinema 8 - Metropolis'],
    specs: {
      resolution: '4K Ultra HD',
      audio: 'Dolby Atmos 7.1',
      hdr: 'Dolby Vision',
      aspectRatio: '2.39:1 Widescreen',
    },
    featured: false,
    isTrending: true,
    isNewRelease: false,
    reviews: [
      {
        id: 'rev-6',
        author: 'Erik Thorne',
        rating: 5,
        date: '1 week ago',
        comment: 'Uncompromising brutality and mythic grandeur. Best medieval fantasy epic in years.',
        likes: 93
      }
    ]
  },
  {
    id: 'whispers-in-the-dark',
    title: 'Whispers in Blackwood Manor',
    tagline: 'Some doors were locked for a reason.',
    synopsis: 'An architectural historian accepts a commission to survey an abandoned Victorian estate on the Cornish coast. As fog rolls in, the manor’s geometry begins to shift, trapping her in a labyrinth of psychological terror.',
    poster: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=800&q=80',
    backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80',
    year: 2024,
    ageRating: 'R',
    duration: '1h 48m',
    genres: ['Horror', 'Mystery', 'Thriller'],
    director: 'Guillermo Vasquez',
    cast: ['Rebecca Hall', 'Dan Stevens', 'Charles Dance'],
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    martRating: 8.7,
    imdbRating: 7.9,
    rottenTomatoes: 92,
    digitalBuyPrice: 14.99,
    digitalRentPrice: 4.99,
    hasTheater: true,
    theaterTicketPrice: 14.00,
    theatersAvailable: ['Starlight Luxe Suites', 'Metropolis Cinema 4'],
    specs: {
      resolution: '4K Ultra HD',
      audio: 'Binaural / 3D Surround Atmos',
      hdr: 'Dolby Vision HDR',
      aspectRatio: '1.66:1 Classical Ratio',
    },
    featured: false,
    isTrending: false,
    isNewRelease: false,
    reviews: [
      {
        id: 'rev-7',
        author: 'Chloe Simmons',
        rating: 4,
        date: '5 days ago',
        comment: 'Genuinely terrifying spatial audio mixing. Wear headphones if watching digital!',
        likes: 38
      }
    ]
  },
  {
    id: 'animation-spirit-isle',
    title: 'Lumina: Keeper of the Lanterns',
    tagline: 'Every dream illuminates the path home.',
    synopsis: 'A spirited young apprentice in a celestial observatory accidentally releases the primordial Starlight into the wild forest below. Together with an ancient stone golem, she sets off on an enchanting odyssey to restore the sky.',
    poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80',
    year: 2024,
    ageRating: 'PG',
    duration: '1h 42m',
    genres: ['Animation', 'Family', 'Fantasy', 'Adventure'],
    director: 'Aoi Miyazaki',
    cast: ['Saoirse Ronan', 'Dev Patel', 'Ian McKellen'],
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    martRating: 9.7,
    imdbRating: 8.8,
    rottenTomatoes: 98,
    digitalBuyPrice: 19.99,
    digitalRentPrice: 5.99,
    hasTheater: true,
    theaterTicketPrice: 13.00,
    theatersAvailable: ['IMAX Laser Dome - Grand Central', 'Indie Cinema House'],
    specs: {
      resolution: '4K Ultra HD Crisp Animation',
      audio: 'Dolby Atmos Orchestral',
      hdr: 'Dolby Vision Wide Color Gamut',
      aspectRatio: '1.85:1 Flat',
    },
    featured: false,
    isTrending: true,
    isNewRelease: true,
    isTopMart: true,
    reviews: [
      {
        id: 'rev-8',
        author: 'David Chen',
        rating: 5,
        date: '3 days ago',
        comment: 'Studio Ghibli magic reimagined with stunning modern animation. A masterpiece for all ages.',
        likes: 215
      }
    ]
  },
  {
    id: 'velocity-overdrive',
    title: 'Velocity: Apex Horizon',
    tagline: 'No speed limit. No second chances.',
    synopsis: 'A retired Grand Prix prodigy is drawn into an unsanctioned underground hypercar rally racing through the neon mountain passes of the Swiss Alps, competing against high-tech prototype vehicles engineered by rogue aerospace firms.',
    poster: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
    backdrop: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=80',
    year: 2024,
    ageRating: 'PG-13',
    duration: '2h 05m',
    genres: ['Action', 'Thriller'],
    director: 'Justin Lin',
    cast: ['Michael B. Jordan', 'Ana de Armas', 'Daniel Craig'],
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    martRating: 8.8,
    imdbRating: 8.0,
    rottenTomatoes: 86,
    digitalBuyPrice: 19.99,
    digitalRentPrice: 5.99,
    hasTheater: true,
    theaterTicketPrice: 15.00,
    theatersAvailable: ['Dolby Cinema 8 - Metropolis'],
    specs: {
      resolution: '4K Ultra HD 60fps',
      audio: 'Dolby Atmos Engine Roar',
      hdr: 'Dolby Vision High Dynamic Range',
      aspectRatio: '2.39:1 Cinemascope',
    },
    featured: false,
    isTrending: true,
    isNewRelease: false,
    reviews: [
      {
        id: 'rev-9',
        author: 'Gearhead Review',
        rating: 5,
        date: '2 weeks ago',
        comment: 'The engine sound mix will test your subwoofers! The practical stunts are unbelievable.',
        likes: 72
      }
    ]
  }
];

export const GENRES_LIST = [
  'All',
  'Sci-Fi',
  'Action',
  'Drama',
  'Thriller',
  'Adventure',
  'Animation',
  'Horror',
  'Romance',
  'Fantasy',
];

export const THEATER_SHOWTIMES = [
  '12:30 PM',
  '03:45 PM',
  '06:30 PM',
  '09:15 PM',
  '11:45 PM'
];

export const THEATER_DATES = [
  { label: 'Today', date: 'Oct 13' },
  { label: 'Tomorrow', date: 'Oct 14' },
  { label: 'Wed', date: 'Oct 15' },
  { label: 'Thu', date: 'Oct 16' },
  { label: 'Fri', date: 'Oct 17' },
  { label: 'Sat', date: 'Oct 18' },
];
