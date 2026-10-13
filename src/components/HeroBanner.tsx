import React from 'react';
import { Play, Ticket, Sparkles, Star, Plus, Check, Volume2 } from 'lucide-react';
import { Movie } from '../types/movie';

interface HeroBannerProps {
  movie: Movie;
  onPlayTrailer: (movie: Movie) => void;
  onBookTickets: (movie: Movie) => void;
  onOpenDigital: (movie: Movie) => void;
  isInWatchlist: boolean;
  onToggleWatchlist: (movie: Movie) => void;
  onSelectMovie: (movie: Movie) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  movie,
  onPlayTrailer,
  onBookTickets,
  onOpenDigital,
  isInWatchlist,
  onToggleWatchlist,
  onSelectMovie,
}) => {
  return (
    <div className="relative w-full h-[580px] sm:h-[650px] overflow-hidden rounded-3xl border border-white/10 shadow-2xl mb-12 group">
      {/* Background Image with dark cinema vignette */}
      <img
        src={movie.backdrop}
        alt={movie.title}
        className="absolute inset-0 w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-1000 ease-out"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-[#0b0c10]/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0b0c10] via-[#0b0c10]/80 to-transparent" />

      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto px-6 sm:px-10 flex flex-col justify-end pb-12 sm:pb-16 z-10">
        <div className="max-w-2xl space-y-4">
          
          {/* Badges row */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600/90 text-white text-xs font-bold tracking-wide uppercase shadow-md shadow-rose-900/50 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Featured Mart Premiere
            </span>
            <span className="px-2.5 py-1 rounded-md bg-white/10 border border-white/20 text-white text-xs font-semibold backdrop-blur-sm">
              {movie.ageRating}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-white/10 border border-white/20 text-slate-300 text-xs font-medium">
              {movie.duration}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-bold">
              {movie.specs.resolution}
            </span>
          </div>

          {/* Title */}
          <h1
            onClick={() => onSelectMovie(movie)}
            className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight cursor-pointer hover:text-rose-400 transition-colors font-['Cinzel']"
          >
            {movie.title}
          </h1>

          {/* Tagline */}
          <p className="text-amber-400/90 text-sm sm:text-base font-semibold italic">
            "{movie.tagline}"
          </p>

          {/* Synopsis */}
          <p className="text-slate-300 text-sm sm:text-base line-clamp-3 leading-relaxed max-w-xl">
            {movie.synopsis}
          </p>

          {/* Scores & Formats badge */}
          <div className="flex flex-wrap items-center gap-4 py-1 text-xs sm:text-sm">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold bg-amber-950/40 border border-amber-600/30 px-2.5 py-1 rounded-lg">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>Mart: {movie.martRating}/10</span>
            </div>
            <div className="text-slate-300 font-semibold bg-white/10 px-2.5 py-1 rounded-lg border border-white/10">
              IMDb: <span className="text-white">{movie.imdbRating}</span>
            </div>
            <div className="text-rose-400 font-semibold bg-rose-950/40 px-2.5 py-1 rounded-lg border border-rose-600/30">
              Rotten Tomatoes: {movie.rottenTomatoes}%
            </div>
            <div className="hidden sm:flex items-center gap-1 text-slate-400 text-xs">
              <Volume2 className="w-3.5 h-3.5 text-slate-300" />
              <span>{movie.specs.audio}</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {/* Play Trailer */}
            <button
              onClick={() => onPlayTrailer(movie)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-slate-950 hover:bg-slate-200 font-bold text-sm shadow-xl transition-all hover:scale-105 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-slate-950 text-slate-950" />
              <span>Watch Trailer</span>
            </button>

            {/* Book Tickets (if in theaters) */}
            {movie.hasTheater && (
              <button
                onClick={() => onBookTickets(movie)}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-xl shadow-rose-950/60 transition-all hover:scale-105 cursor-pointer"
              >
                <Ticket className="w-4 h-4" />
                <span>Book Tickets (${movie.theaterTicketPrice})</span>
              </button>
            )}

            {/* Digital Buy/Rent */}
            <button
              onClick={() => onOpenDigital(movie)}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-all cursor-pointer backdrop-blur-sm"
            >
              <span>4K Digital from ${movie.digitalRentPrice}</span>
            </button>

            {/* Watchlist toggle */}
            <button
              onClick={() => onToggleWatchlist(movie)}
              className={`p-3 rounded-xl border transition-all cursor-pointer ${
                isInWatchlist
                  ? 'bg-rose-600/30 border-rose-500 text-rose-400'
                  : 'bg-white/5 border-white/15 text-slate-300 hover:text-white hover:bg-white/10'
              }`}
              title={isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
            >
              {isInWatchlist ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
