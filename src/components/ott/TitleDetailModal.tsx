import React, { useState } from 'react';
import { 
  X, 
  Play, 
  Plus, 
  Check, 
  Star, 
  Server, 
  Languages, 
  Subtitles, 
  AlertCircle, 
  Clock, 
  Film, 
  ShieldAlert,
  Tv
} from 'lucide-react';
import { Title, StreamingSource } from '../../types/ott';

interface TitleDetailModalProps {
  title: Title;
  sources: StreamingSource[];
  isInWatchlist: boolean;
  onToggleWatchlist: (title: Title) => void;
  onWatchNow: (title: Title) => void;
  onClose: () => void;
  onOpenDmca: (title: Title) => void;
}

export const TitleDetailModal: React.FC<TitleDetailModalProps> = ({
  title,
  sources,
  isInWatchlist,
  onToggleWatchlist,
  onWatchNow,
  onClose,
  onOpenDmca,
}) => {
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const activeSources = sources.filter((s) => s.is_active && s.health_status === 'operational');
  const hasPlayableSource = activeSources.length > 0;

  const currentSeason = title.seasons?.find((s) => s.season_number === selectedSeason) || title.seasons?.[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#141414] border border-white/15 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
        
        {/* Backdrop Banner */}
        <div className="relative h-64 sm:h-80 overflow-hidden flex-shrink-0">
          <img
            src={title.backdrop_url}
            alt={title.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#141414]/90 via-transparent to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/70 text-gray-300 hover:text-white transition-colors cursor-pointer z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Banner Details */}
          <div className="absolute bottom-6 left-6 right-6 flex items-end gap-5">
            <img
              src={title.poster_url}
              alt={title.title}
              className="hidden sm:block w-28 h-40 object-cover rounded-xl border border-white/20 shadow-2xl flex-shrink-0"
            />
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[#E50914] text-white text-[10px] font-black uppercase">
                  {title.type === 'series' ? 'TV Series' : 'Movie'}
                </span>
                <span className="px-2 py-0.5 rounded bg-black/60 border border-white/20 text-gray-200 text-xs font-semibold">
                  {title.age_rating}
                </span>
                <span className="text-xs text-gray-300 font-medium">
                  {title.release_year} • {title.duration_minutes}m
                </span>
                {title.is_public_domain && (
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                    Public Domain Classic
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white">
                {title.title}
              </h1>
              {title.tagline && (
                <p className="text-amber-400 text-xs sm:text-sm font-semibold italic">
                  "{title.tagline}"
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Action CTAs & Availability Status */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#1b1b1b] border border-white/10">
            <div className="flex items-center gap-3">
              {/* Watch Now Button */}
              {hasPlayableSource ? (
                <button
                  onClick={() => onWatchNow(title)}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#E50914] hover:bg-red-600 text-white font-extrabold text-sm shadow-xl shadow-red-950/60 transition-all hover:scale-105 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Watch Now</span>
                </button>
              ) : (
                <div className="px-4 py-2.5 rounded-xl bg-neutral-800 text-gray-400 font-bold text-xs border border-white/10 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                  <span>Streaming Not Available Yet</span>
                </div>
              )}

              {/* Add to List */}
              <button
                onClick={() => onToggleWatchlist(title)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors cursor-pointer border border-white/10"
              >
                {isInWatchlist ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>In My List</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Add to My List</span>
                  </>
                )}
              </button>
            </div>

            {/* Availability Indicator */}
            <div className="text-xs">
              {hasPlayableSource ? (
                <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {activeSources.length} Authorized Stream{activeSources.length > 1 ? 's' : ''} Ready
                </span>
              ) : (
                <span className="text-gray-400 font-medium">
                  Catalog entry awaiting distribution license verification
                </span>
              )}
            </div>
          </div>

          {/* Synopsis */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Storyline
            </h3>
            <p className="text-gray-200 text-sm sm:text-base leading-relaxed">
              {title.synopsis}
            </p>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-[#181818] border border-white/5 text-xs">
            <div>
              <span className="text-gray-400 font-bold uppercase text-[10px] block">Genres</span>
              <span className="text-white font-semibold mt-0.5 block">{title.genres.join(', ')}</span>
            </div>
            <div>
              <span className="text-gray-400 font-bold uppercase text-[10px] block">Release Date</span>
              <span className="text-white font-semibold mt-0.5 block">{title.release_date || title.release_year}</span>
            </div>
            <div>
              <span className="text-gray-400 font-bold uppercase text-[10px] block">Ratings</span>
              <div className="text-amber-400 font-semibold mt-0.5 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{title.mart_rating}/10 (IMDb {title.imdb_rating})</span>
              </div>
            </div>
            <div>
              <span className="text-gray-400 font-bold uppercase text-[10px] block">Audio Languages</span>
              <span className="text-white font-semibold mt-0.5 block">
                {title.languages.map((l) => l.name).join(', ')}
              </span>
            </div>
          </div>

          {/* Series Episode Browser (If TV Series) */}
          {title.type === 'series' && title.seasons && title.seasons.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Tv className="w-4 h-4 text-[#E50914]" />
                  <span>Episodes & Seasons</span>
                </h3>

                {title.seasons.length > 1 && (
                  <select
                    value={selectedSeason}
                    onChange={(e) => setSelectedSeason(Number(e.target.value))}
                    className="bg-[#1b1b1b] border border-white/15 rounded-lg px-2.5 py-1 text-xs text-white"
                  >
                    {title.seasons.map((s) => (
                      <option key={s.season_number} value={s.season_number}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="space-y-2">
                {currentSeason?.episodes.map((ep) => (
                  <div
                    key={ep.id}
                    className="p-3 bg-[#181818] rounded-xl border border-white/5 flex gap-3 items-center hover:bg-white/5 transition-colors group cursor-pointer"
                    onClick={() => onWatchNow(title)}
                  >
                    <div className="w-7 text-center font-bold text-gray-500 group-hover:text-white">
                      {ep.episode_number}
                    </div>
                    <img
                      src={ep.still_url}
                      alt={ep.title}
                      className="w-20 h-14 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-white truncate">{ep.title}</h4>
                        <span className="text-[10px] text-gray-400">{ep.duration_minutes}m</span>
                      </div>
                      <p className="text-[11px] text-gray-400 line-clamp-1 mt-0.5">
                        {ep.synopsis}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Authorized Sources Status Table */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-amber-400" />
              Verified Playback Infrastructure
            </h3>
            <div className="bg-[#181818] rounded-2xl border border-white/10 divide-y divide-white/5 overflow-hidden">
              {sources.length === 0 ? (
                <div className="p-4 text-xs text-gray-400 text-center">
                  No streaming sources have been provisioned yet for this record.
                </div>
              ) : (
                sources.map((s) => (
                  <div key={s.id} className="p-3 flex items-center justify-between text-xs">
                    <div>
                      <div className="text-white font-bold">{s.server_name}</div>
                      <div className="text-[10px] text-gray-400">
                        {s.provider_name} • License Ref: {s.license_reference || 'N/A'}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-300 font-mono">{s.latency_ms}ms</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          s.health_status === 'operational'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                            : 'bg-red-950 text-red-400 border border-red-500/30'
                        }`}
                      >
                        {s.health_status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Legal Attribution & DMCA Report Button */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-gray-400">
            <p>
              Metadata provided for catalog identification. This product uses the TMDB API but is not endorsed or certified by TMDB.
            </p>
            <button
              onClick={() => onOpenDmca(title)}
              className="text-gray-400 hover:text-red-400 underline cursor-pointer whitespace-nowrap flex items-center gap-1 text-[11px]"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Report Copyright / DMCA Notice</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
