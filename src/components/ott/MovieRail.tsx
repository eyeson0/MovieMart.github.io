import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Plus, Check, Info, Star } from 'lucide-react';
import { Title } from '../../types/ott';

interface MovieRailProps {
  title: string;
  titles: Title[];
  onSelectTitle: (title: Title) => void;
  onWatchNow: (title: Title) => void;
  watchlistIds: string[];
  onToggleWatchlist: (title: Title) => void;
  progressMap?: Record<string, number>; // titleId -> percentage
}

export const MovieRail: React.FC<MovieRailProps> = ({
  title,
  titles,
  onSelectTitle,
  onWatchNow,
  watchlistIds,
  onToggleWatchlist,
  progressMap = {},
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    const scrollAmount = clientWidth * 0.75;
    scrollRef.current.scrollTo({
      left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
      behavior: 'smooth',
    });
  };

  if (titles.length === 0) return null;

  return (
    <div className="relative my-8 group/rail">
      {/* Rail Title */}
      <div className="px-4 sm:px-6 lg:px-8 mb-3 flex items-center justify-between">
        <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <span>{title}</span>
          <span className="text-xs text-gray-500 font-semibold">({titles.length})</span>
        </h2>
      </div>

      {/* Rail Container */}
      <div className="relative">
        {/* Left Scroll Arrow */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-0 bottom-0 z-20 w-12 bg-black/70 hover:bg-black/90 text-white flex items-center justify-center opacity-0 group-hover/rail:opacity-100 transition-opacity cursor-pointer"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>

        {/* Scrollable Posters List */}
        <div
          ref={scrollRef}
          className="flex gap-3 sm:gap-4 overflow-x-auto px-4 sm:px-6 lg:px-8 pb-4 scrollbar-none scroll-smooth"
        >
          {titles.map((item) => {
            const inWatchlist = watchlistIds.includes(item.id);
            const progress = progressMap[item.id];

            return (
              <div
                key={item.id}
                className="flex-none w-36 sm:w-48 group/card bg-[#181818] rounded-xl overflow-hidden border border-white/10 hover:border-red-600/50 transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl flex flex-col"
              >
                {/* Poster Area */}
                <div
                  onClick={() => onSelectTitle(item)}
                  className="relative aspect-[2/3] bg-neutral-900 cursor-pointer overflow-hidden"
                >
                  <img
                    src={item.poster_url}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                  />

                  {/* Top Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {item.is_trending && (
                      <span className="px-1.5 py-0.5 rounded bg-[#E50914] text-[9px] font-black uppercase text-white shadow">
                        Trending
                      </span>
                    )}
                    {item.is_public_domain && (
                      <span className="px-1.5 py-0.5 rounded bg-amber-500 text-[9px] font-black uppercase text-black shadow">
                        Classics
                      </span>
                    )}
                    {item.region_category === 'hindi_dubbed' && (
                      <span className="px-1.5 py-0.5 rounded bg-purple-600 text-[9px] font-black uppercase text-white shadow">
                        Hindi Dub
                      </span>
                    )}
                    {item.region_category === 'nepali' && (
                      <span className="px-1.5 py-0.5 rounded bg-blue-600 text-[9px] font-black uppercase text-white shadow">
                        Nepali
                      </span>
                    )}
                  </div>

                  {/* Hover Quick Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/card:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onWatchNow(item);
                      }}
                      className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform shadow-lg cursor-pointer"
                      title="Watch Now"
                    >
                      <Play className="w-5 h-5 fill-black ml-0.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWatchlist(item);
                      }}
                      className={`w-10 h-10 rounded-full border flex items-center justify-center transition-transform hover:scale-110 cursor-pointer ${
                        inWatchlist
                          ? 'bg-[#E50914] border-red-500 text-white'
                          : 'bg-black/80 border-white/30 text-white hover:bg-black'
                      }`}
                      title={inWatchlist ? 'In My List' : 'Add to My List'}
                    >
                      {inWatchlist ? <Check className="w-5 h-5 text-white" /> : <Plus className="w-5 h-5" />}
                    </button>
                  </div>

                  {/* Watch Progress Bar */}
                  {typeof progress === 'number' && progress > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-neutral-800">
                      <div
                        className="h-full bg-[#E50914]"
                        style={{ width: `${Math.min(100, progress)}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Card Info */}
                <div
                  onClick={() => onSelectTitle(item)}
                  className="p-3 flex-1 flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm text-white group-hover/card:text-[#E50914] transition-colors truncate">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-1">
                      <span>{item.release_year}</span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5 text-amber-400 font-bold">
                        <Star className="w-2.5 h-2.5 fill-amber-400" />
                        {item.mart_rating}
                      </span>
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1.5 truncate">
                    {item.genres.slice(0, 2).join(', ')}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Scroll Arrow */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-0 bottom-0 z-20 w-12 bg-black/70 hover:bg-black/90 text-white flex items-center justify-center opacity-0 group-hover/rail:opacity-100 transition-opacity cursor-pointer"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
};
