export interface Review {
  id: string;
  author: string;
  avatar?: string;
  rating: number; // 1 to 5
  date: string;
  comment: string;
  likes: number;
}

export interface SnackItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'popcorn' | 'drink' | 'combos' | 'sweets';
}

export interface MerchandiseItem {
  id: string;
  movieId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  badge?: string;
  inStock: boolean;
}

export interface Movie {
  id: string;
  title: string;
  tagline: string;
  synopsis: string;
  poster: string;
  backdrop: string;
  year: number;
  ageRating: string; // "PG-13", "R", "PG"
  duration: string; // "2h 46m"
  genres: string[];
  director: string;
  cast: string[];
  trailerUrl: string; // high quality video trailer
  
  // Scoring
  martRating: number; // e.g. 9.4
  imdbRating: number; // e.g. 8.8
  rottenTomatoes: number; // e.g. 93%
  
  // Mart Offerings
  digitalBuyPrice: number; // e.g. 19.99
  digitalRentPrice: number; // e.g. 5.99
  hasTheater: boolean;
  theaterTicketPrice?: number; // e.g. 14.50
  theatersAvailable?: string[];
  
  // Tech specs
  specs: {
    resolution: string; // "4K Ultra HD"
    audio: string; // "Dolby Atmos 7.1.4"
    hdr: string; // "Dolby Vision"
    aspectRatio: string; // "2.39:1 Cinemascope"
  };
  
  featured?: boolean;
  isTrending?: boolean;
  isNewRelease?: boolean;
  isTopMart?: boolean;
  
  reviews: Review[];
  merchandise?: MerchandiseItem[];
}

export interface CartItem {
  id: string;
  type: 'digital_buy' | 'digital_rent' | 'ticket' | 'merch';
  movieId: string;
  movieTitle: string;
  poster: string;
  price: number;
  quantity: number;
  details?: {
    theater?: string;
    showtime?: string;
    date?: string;
    seats?: string[];
    snackAddons?: { name: string; price: number; quantity: number }[];
    editionName?: string;
  };
}

export interface Booking {
  id: string;
  bookingCode: string;
  movieId: string;
  movieTitle: string;
  poster: string;
  theater: string;
  showtime: string;
  date: string;
  seats: string[];
  snacks: { name: string; quantity: number; price: number }[];
  totalAmount: number;
  purchasedAt: string;
}

export interface DigitalLicense {
  id: string;
  movieId: string;
  movieTitle: string;
  poster: string;
  backdrop: string;
  type: 'buy' | 'rent';
  expiresAt?: string;
  purchasedAt: string;
  streamQuality: string;
  videoUrl: string;
}
