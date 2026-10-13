import React from 'react';
import { Play, Ticket, Bookmark, Star, Sparkles } from 'lucide-react';
import { Movie } from '../types/movie';

interface MovieCardProps {
  movie: Movie;
  onSelect: (movie: Movie) => void;
  onPlayTrailer: (movie: Movie) => void;
  onBookTickets: (movie: Movie) => void;
  onOpenDigital: (movie: Movie) => void;
  isInWatchlist: boolean;
  onToggleWatchlist: (movie: Movie) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  onSelect,
  onPlayTrailer,
  onBookTickets,
  onOpenDigital,
  isInWatchlist,
  onToggleWatchlist,
}) => {
  return (
    <div className="group relative bg-[#131622] rounded-2xl overflow-hidden border border-white/10 hover:border-rose-500/50 transition-all duration-300 flex flex-col hover:shadow-2xl hover:shadow-rose-950/20">
      {/* Poster area */}
      <div className="relative aspect-[2/3] overflow-hidden bg-slate-900">
        <img
          src={movie.poster}
          alt={movie.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="flex flex-col gap-1.5">
            {movie.isNewRelease && (
              <span className="px-2 py-0.5 rounded bg-rose-600 text-[10px] font-black uppercase tracking-wider text-white shadow-md">
                New
              </span>
            )}
            {movie.hasTheater && (
              <span className="px-2 py-0.5 rounded bg-amber-500 text-[10px] font-black uppercase tracking-wider text-slate-950 shadow-md">
                Cinema
              </span>
            )}
          </div>

          {/* Watchlist button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWatchlist(movie);
            }}
            className={`pointer-events-auto p-2 rounded-xl backdrop-blur-md transition-all cursor-pointer ${
              isInWatchlist
                ? 'bg-rose-600 text-white'
                : 'bg-black/60 text-slate-200 hover:text-white hover:bg-black/80'
            }`}
            title={isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
          >
            <Bookmark className={`w-4 h-4 ${isInWatchlist ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Play trailer overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlayTrailer(movie);
            }}
            className="w-12 h-12 rounded-full bg-white text-slate-950 flex items-center justify-center hover:scale-110 transition-transform shadow-xl cursor-pointer"
            title="Watch Trailer"
          >
            <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
          </button>
        </div>

        {/* Bottom quality tag */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] font-bold text-white/90">
          <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm border border-white/10">
            {movie.specs.resolution.split(' ')[0]}
          </span>
          <div className="flex items-center gap-1 bg-black/70 backdrop-blur-sm border border-white/10 px-1.5 py-0.5 rounded text-amber-400">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{movie.martRating}</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div onClick={() => onSelect(movie)} className="cursor-pointer">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>{movie.year} • {movie.duration}</span>
            <span className="text-slate-500 font-semibold">{movie.ageRating}</span>
          </div>
          <h3 className="font-bold text-base text-white group-hover:text-rose-400 transition-colors line-clamp-1">
            {movie.title}
          </h3>
          <p className="text-xs text-slate-400 mt-1 line-clamp-1">
            {movie.genres.join(', ')}
          </p>
        </div>

        {/* Pricing & Actions */}
        <div className="mt-4 pt-3 border-t border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Digital Mart</span>
            <span className="font-bold text-slate-200">
              Rent <span className="text-rose-400">${movie.digitalRentPrice}</span> / Buy <span className="text-white">${movie.digitalBuyPrice}</span>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            {movie.hasTheater ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onBookTickets(movie);
                }}
                className="w-full py-2 px-2 rounded-xl bg-amber-500/15 hover:bg-amber-500 text-amber-400 hover:text-slate-950 font-bold text-xs flex items-center justify-center gap-1 border border-amber-500/30 transition-all cursor-pointer"
              >
                <Ticket className="w-3.5 h-3.5" />
                <span>Tickets</span>
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(movie);
                }}
                className="w-full py-2 px-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-semibold text-xs border border-white/10 transition-all cursor-pointer"
              >
                Details
              </button>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenDigital(movie);
              }}
              className="w-full py-2 px-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-md shadow-rose-950/40 transition-all cursor-pointer"
            >
              <span>Buy / Stream</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
