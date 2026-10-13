import React, { useState } from 'react';
import { Film, Search, Bookmark, ShoppingBag, Ticket, Clapperboard, X } from 'lucide-react';
import { Movie } from '../types/movie';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeTab: 'all' | 'theaters' | 'digital' | 'merch';
  onTabChange: (tab: 'all' | 'theaters' | 'digital' | 'merch') => void;
  cartCount: number;
  watchlistCount: number;
  onOpenCart: () => void;
  onOpenVault: (initialTab?: 'library' | 'tickets' | 'watchlist') => void;
  movies: Movie[];
  onSelectMovie: (movie: Movie) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
  activeTab,
  onTabChange,
  cartCount,
  watchlistCount,
  onOpenCart,
  onOpenVault,
  movies,
  onSelectMovie,
}) => {
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  // Filter movies for quick dropdown search suggestions
  const matchingMovies = searchQuery.trim()
    ? movies
        .filter(
          (m) =>
            m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.genres.some((g) => g.toLowerCase().includes(searchQuery.toLowerCase())) ||
            m.director.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : [];

  return (
    <header className="sticky top-0 z-40 bg-[#0c0e14]/90 backdrop-blur-md border-b border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => onTabChange('all')}
              className="flex items-center gap-3 text-left focus:outline-none group cursor-pointer"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-rose-700 via-rose-600 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-950/40 group-hover:scale-105 transition-transform">
                <Film className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight text-white flex items-center gap-1 font-['Cinzel']">
                  MOVIE<span className="text-rose-500">MART</span>
                </span>
                <span className="block text-[10px] tracking-widest uppercase text-slate-400 font-semibold">
                  Cinema & Digital Vault
                </span>
              </div>
            </button>

            {/* Navigation Tabs */}
            <nav className="hidden md:flex items-center gap-1 bg-white/[0.04] p-1 rounded-xl border border-white/10">
              <button
                onClick={() => onTabChange('all')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                All Releases
              </button>
              <button
                onClick={() => onTabChange('theaters')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'theaters'
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Ticket className="w-4 h-4 text-amber-400" />
                In Theaters
              </button>
              <button
                onClick={() => onTabChange('digital')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'digital'
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Clapperboard className="w-4 h-4 text-sky-400" />
                4K Stream & Buy
              </button>
              <button
                onClick={() => onTabChange('merch')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'merch'
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Collectibles & Merch
              </button>
            </nav>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-md relative hidden sm:block">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  setShowSearchDropdown(true);
                }}
                onFocus={() => setShowSearchDropdown(true)}
                placeholder="Search movies, directors, genres..."
                className="w-full bg-[#161a26] border border-white/10 rounded-xl pl-10 pr-9 py-2 text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick dropdown suggestions */}
            {showSearchDropdown && matchingMovies.length > 0 && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowSearchDropdown(false)}
                />
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#131622] border border-white/15 rounded-xl shadow-2xl overflow-hidden z-20 divide-y divide-white/5">
                  <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Quick Results
                  </div>
                  {matchingMovies.map((movie) => (
                    <button
                      key={movie.id}
                      onClick={() => {
                        onSelectMovie(movie);
                        setShowSearchDropdown(false);
                      }}
                      className="w-full px-3 py-2.5 flex items-center gap-3 hover:bg-rose-950/30 text-left transition-colors cursor-pointer group"
                    >
                      <img
                        src={movie.poster}
                        alt={movie.title}
                        className="w-10 h-14 object-cover rounded-md flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-white group-hover:text-rose-400 truncate">
                          {movie.title}
                        </div>
                        <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                          <span>{movie.year}</span>
                          <span>•</span>
                          <span>{movie.genres.slice(0, 2).join(', ')}</span>
                          <span>•</span>
                          <span className="text-amber-400 font-medium">★ {movie.martRating}</span>
                        </div>
                      </div>
                      <div className="text-xs font-bold text-rose-400 bg-rose-950/60 px-2 py-1 rounded">
                        ${movie.digitalBuyPrice}
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Watchlist */}
            <button
              onClick={() => onOpenVault('watchlist')}
              className="relative p-2.5 rounded-xl bg-white/[0.04] border border-white/10 hover:bg-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
              title="Watchlist"
            >
              <Bookmark className="w-5 h-5" />
              {watchlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-600 text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-lg">
                  {watchlistCount}
                </span>
              )}
            </button>

            {/* My Vault (Tickets & Purchased Digital Movies) */}
            <button
              onClick={() => onOpenVault('library')}
              className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 hover:bg-white/10 text-slate-200 hover:text-white transition-all cursor-pointer text-sm font-medium"
            >
              <Ticket className="w-4 h-4 text-amber-400" />
              <span>My Vault</span>
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-semibold text-sm shadow-lg shadow-rose-900/40 transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="w-5 h-5 bg-amber-400 text-slate-950 text-xs font-black rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center justify-between py-2 border-t border-white/5 overflow-x-auto gap-2">
          <button
            onClick={() => onTabChange('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
              activeTab === 'all' ? 'bg-rose-600 text-white' : 'text-slate-300'
            }`}
          >
            All Movies
          </button>
          <button
            onClick={() => onTabChange('theaters')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1 ${
              activeTab === 'theaters' ? 'bg-rose-600 text-white' : 'text-slate-300'
            }`}
          >
            <Ticket className="w-3.5 h-3.5 text-amber-400" />
            In Theaters
          </button>
          <button
            onClick={() => onTabChange('digital')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1 ${
              activeTab === 'digital' ? 'bg-rose-600 text-white' : 'text-slate-300'
            }`}
          >
            <Clapperboard className="w-3.5 h-3.5 text-sky-400" />
            4K Stream
          </button>
          <button
            onClick={() => onOpenVault('library')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap text-slate-300"
          >
            My Vault
          </button>
        </div>

      </div>
    </header>
  );
};
