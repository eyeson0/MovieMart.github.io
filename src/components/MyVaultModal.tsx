import React, { useState } from 'react';
import { X, Film, Ticket, Bookmark, Play, QrCode, Trash2, Calendar, MapPin, Sparkles } from 'lucide-react';
import { Movie, Booking, DigitalLicense } from '../types/movie';

interface MyVaultModalProps {
  initialTab?: 'library' | 'tickets' | 'watchlist';
  onClose: () => void;
  licenses: DigitalLicense[];
  bookings: Booking[];
  watchlist: Movie[];
  onPlayLicense: (license: DigitalLicense) => void;
  onRemoveFromWatchlist: (movieId: string) => void;
  onSelectMovie: (movie: Movie) => void;
  onOpenTicketsForMovie: (movie: Movie) => void;
}

export const MyVaultModal: React.FC<MyVaultModalProps> = ({
  initialTab = 'library',
  onClose,
  licenses,
  bookings,
  watchlist,
  onPlayLicense,
  onRemoveFromWatchlist,
  onSelectMovie,
  onOpenTicketsForMovie,
}) => {
  const [activeTab, setActiveTab] = useState<'library' | 'tickets' | 'watchlist'>(initialTab);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#111422] border border-white/15 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[88vh] flex flex-col">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#161a2b] border-b border-white/10 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 text-white flex items-center justify-center shadow-lg">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white font-['Cinzel']">
                My Movie Vault
              </h2>
              <p className="text-xs text-slate-400">
                Your digital streaming licenses, theater passes, and saved titles
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 py-3 bg-[#131625] border-b border-white/10 flex items-center gap-2 flex-shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('library')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'library'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Film className="w-4 h-4" />
            <span>Streaming Library ({licenses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('tickets')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'tickets'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Ticket className="w-4 h-4 text-amber-400" />
            <span>Cinema Passes ({bookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('watchlist')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'watchlist'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bookmark className="w-4 h-4 text-rose-400" />
            <span>Watchlist ({watchlist.length})</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          
          {/* TAB 1: Streaming Library */}
          {activeTab === 'library' && (
            <div>
              {licenses.length === 0 ? (
                <div className="py-16 text-center text-slate-400 space-y-3">
                  <Film className="w-12 h-12 text-slate-600 mx-auto" />
                  <p className="text-base font-bold text-slate-300">No movies in your library yet</p>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Purchase 4K UHD lifetime licenses or rent titles from the MovieMart digital catalog to stream them anytime.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {licenses.map((lic) => (
                    <div
                      key={lic.id}
                      className="bg-[#161a29] rounded-2xl overflow-hidden border border-white/10 hover:border-rose-500/40 transition-all flex flex-col group shadow-lg"
                    >
                      <div className="relative aspect-video bg-black overflow-hidden">
                        <img
                          src={lic.poster}
                          alt={lic.movieTitle}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => onPlayLicense(lic)}
                            className="w-12 h-12 rounded-full bg-rose-600 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-xl cursor-pointer"
                          >
                            <Play className="w-5 h-5 fill-white ml-0.5" />
                          </button>
                        </div>
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[10px] font-bold text-white border border-white/10">
                          {lic.type === 'buy' ? 'Lifetime 4K' : 'Active Rental'}
                        </span>
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-bold text-sm text-white truncate">
                            {lic.movieTitle}
                          </h4>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {lic.streamQuality}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                          <span className="text-[10px] text-slate-400">
                            {lic.expiresAt ? `Expires: ${lic.expiresAt}` : 'Permanently in Vault'}
                          </span>
                          <button
                            onClick={() => onPlayLicense(lic)}
                            className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                          >
                            <Play className="w-3 h-3 fill-white" />
                            <span>Play Stream</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Cinema Passes */}
          {activeTab === 'tickets' && (
            <div>
              {bookings.length === 0 ? (
                <div className="py-16 text-center text-slate-400 space-y-3">
                  <Ticket className="w-12 h-12 text-slate-600 mx-auto" />
                  <p className="text-base font-bold text-slate-300">No active cinema tickets</p>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Book seats for current releases screening in IMAX, Dolby Cinema, and partner theaters.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((b) => (
                    <div
                      key={b.id}
                      className="bg-gradient-to-r from-[#171b2d] to-[#1c2237] rounded-2xl p-5 border border-white/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-xl"
                    >
                      <div className="flex items-start gap-4">
                        <img
                          src={b.poster}
                          alt={b.movieTitle}
                          className="w-16 h-24 rounded-xl object-cover flex-shrink-0"
                        />
                        <div>
                          <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 text-[10px] font-black uppercase">
                            CONFIRMED PASS
                          </span>
                          <h4 className="text-base font-bold text-white mt-1">{b.movieTitle}</h4>
                          <p className="text-xs text-amber-300 font-medium flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3.5 h-3.5" /> {b.theater}
                          </p>
                          <p className="text-xs text-slate-300 flex items-center gap-1 mt-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            {b.date} • {b.showtime}
                          </p>
                          <p className="text-xs font-bold text-white mt-1">
                            Seats: <span className="text-amber-400">{b.seats.join(', ')}</span>
                          </p>
                        </div>
                      </div>

                      <div className="bg-white p-3 rounded-2xl flex flex-col items-center self-center sm:self-auto flex-shrink-0 shadow-lg">
                        <QrCode className="w-16 h-16 text-slate-950" />
                        <span className="text-[10px] font-mono font-bold text-slate-800 mt-1">
                          {b.bookingCode}
                        </span>
                        <span className="text-[8px] text-slate-500 font-semibold uppercase mt-0.5">
                          Scan At Theater Door
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Watchlist */}
          {activeTab === 'watchlist' && (
            <div>
              {watchlist.length === 0 ? (
                <div className="py-16 text-center text-slate-400 space-y-3">
                  <Bookmark className="w-12 h-12 text-slate-600 mx-auto" />
                  <p className="text-base font-bold text-slate-300">Your watchlist is empty</p>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Click the bookmark icon on any movie poster to save it here for later.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {watchlist.map((movie) => (
                    <div
                      key={movie.id}
                      className="bg-[#161a29] rounded-2xl p-3 border border-white/10 flex gap-3 items-center"
                    >
                      <img
                        src={movie.poster}
                        alt={movie.title}
                        className="w-16 h-22 rounded-xl object-cover flex-shrink-0 cursor-pointer"
                        onClick={() => {
                          onClose();
                          onSelectMovie(movie);
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <h4
                          onClick={() => {
                            onClose();
                            onSelectMovie(movie);
                          }}
                          className="font-bold text-sm text-white truncate cursor-pointer hover:text-rose-400"
                        >
                          {movie.title}
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {movie.year} • {movie.genres[0]}
                        </p>
                        <div className="flex items-center gap-2 mt-3">
                          <button
                            onClick={() => {
                              onClose();
                              onSelectMovie(movie);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs cursor-pointer"
                          >
                            View
                          </button>
                          <button
                            onClick={() => onRemoveFromWatchlist(movie.id)}
                            className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-white/5 cursor-pointer"
                            title="Remove from Watchlist"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
