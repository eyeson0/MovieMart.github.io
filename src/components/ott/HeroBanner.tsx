import React from 'react';
import { Play, Plus, Check, Info, Star, Sparkles, Volume2 } from 'lucide-react';
import { Title } from '../../types/ott';

interface HeroBannerProps {
  title: Title;
  onWatchNow: (title: Title) => void;
  onMoreInfo: (title: Title) => void;
  isInWatchlist: boolean;
  onToggleWatchlist: (title: Title) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  title,
  onWatchNow,
  onMoreInfo,
  isInWatchlist,
  onToggleWatchlist,
}) => {
  return (
    <div className="relative w-full h-[620px] sm:h-[720px] overflow-hidden">
      {/* Background Backdrop with Cinematic Vignette Gradients */}
      <img
        src={title.backdrop_url}
        alt={title.title}
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      {/* Dark gradient overlay matching #090909 */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#090909] via-[#090909]/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#090909] via-[#090909]/75 to-transparent max-w-4xl" />

      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-16 sm:pb-24 z-10">
        <div className="max-w-2xl space-y-4">
          
          {/* Badges row */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-2.5 py-1 rounded bg-[#E50914] text-white text-[11px] font-black uppercase tracking-wider">
              {title.type === 'series' ? 'Featured Series' : 'Featured Movie'}
            </span>
            <span className="px-2 py-0.5 rounded bg-black/60 border border-white/20 text-gray-200 text-xs font-semibold">
              {title.age_rating || 'PG-13'}
            </span>
            <span className="text-xs text-gray-300 font-medium">
              {title.release_year} • {title.duration_minutes}m
            </span>
            <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30 text-[10px] font-bold">
              4K Ultra HD
            </span>
            {title.is_public_domain && (
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                Public Domain Classic
              </span>
            )}
          </div>

          {/* Title Heading */}
          <h1
            onClick={() => onMoreInfo(title)}
            className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none cursor-pointer hover:text-gray-200 transition-colors drop-shadow-lg"
          >
            {title.title}
          </h1>

          {/* Tagline */}
          {title.tagline && (
            <p className="text-amber-400 text-xs sm:text-sm font-semibold italic">
              "{title.tagline}"
            </p>
          )}

          {/* Synopsis */}
          <p className="text-gray-300 text-sm sm:text-base line-clamp-3 leading-relaxed max-w-xl drop-shadow">
            {title.synopsis}
          </p>

          {/* Ratings row */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-gray-300 py-1">
            <div className="flex items-center gap-1.5 text-amber-400">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>Mart Score: {title.mart_rating}/10</span>
            </div>
            {title.rotten_tomatoes_pct && (
              <div className="text-red-400">
                Rotten Tomatoes: {title.rotten_tomatoes_pct}%
              </div>
            )}
            <div className="text-gray-400">
              Genres: <span className="text-white">{title.genres.join(', ')}</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {/* Watch Now Button */}
            <button
              onClick={() => onWatchNow(title)}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-white hover:bg-gray-200 text-black font-extrabold text-sm sm:text-base shadow-2xl transition-all hover:scale-105 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-black text-black" />
              <span>Watch Now</span>
            </button>

            {/* Add to My List Button */}
            <button
              onClick={() => onToggleWatchlist(title)}
              className="flex items-center gap-2 px-5 py-3 rounded-lg bg-[#181818]/90 hover:bg-[#282828] text-white border border-white/20 font-bold text-sm sm:text-base backdrop-blur-sm transition-all cursor-pointer"
            >
              {isInWatchlist ? (
                <>
                  <Check className="w-5 h-5 text-emerald-400" />
                  <span>In My List</span>
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  <span>My List</span>
                </>
              )}
            </button>

            {/* More Info Button */}
            <button
              onClick={() => onMoreInfo(title)}
              className="flex items-center gap-2 px-5 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-sm sm:text-base backdrop-blur-sm transition-all cursor-pointer border border-white/10"
            >
              <Info className="w-5 h-5" />
              <span>More Info</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
