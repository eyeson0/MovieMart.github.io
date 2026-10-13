import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Search, 
  X, 
  Bookmark, 
  Sparkles, 
  ShieldAlert, 
  User, 
  Film, 
  Tv, 
  Languages, 
  Clock,
  Layers,
  ChevronDown
} from 'lucide-react';
import { Title, AdFreePassStatus } from '../../types/ott';

interface NavbarProps {
  currentView: 'home' | 'movies' | 'series' | 'dubbed' | 'my-list' | 'admin' | 'search';
  onNavigate: (view: 'home' | 'movies' | 'series' | 'dubbed' | 'my-list' | 'admin' | 'search') => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  allTitles: Title[];
  onSelectTitle: (title: Title) => void;
  watchlistCount: number;
  adPassStatus: AdFreePassStatus;
  onOpenRewardModal: () => void;
  currentUserRole: 'user' | 'admin';
  onToggleRole: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  searchQuery,
  onSearchChange,
  allTitles,
  onSelectTitle,
  watchlistCount,
  adPassStatus,
  onOpenRewardModal,
  currentUserRole,
  onToggleRole,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [countdownText, setCountdownText] = useState('');

  // Navbar background opacity on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Format 24-hour pass countdown
  useEffect(() => {
    if (!adPassStatus.hasActivePass || !adPassStatus.expiresAt) {
      setCountdownText('');
      return;
    }

    const updateTimer = () => {
      const exp = new Date(adPassStatus.expiresAt!).getTime();
      const now = Date.now();
      const diff = Math.max(0, Math.floor((exp - now) / 1000));
      if (diff === 0) {
        setCountdownText('Expired');
        return;
      }
      const hours = Math.floor(diff / 3600);
      const mins = Math.floor((diff % 3600) / 60);
      const secs = diff % 60;
      setCountdownText(`${hours}h ${mins}m ${secs < 10 ? '0' : ''}${secs}s`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [adPassStatus]);

  const searchSuggestions = searchQuery.trim()
    ? allTitles
        .filter(
          (t) =>
            t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.genres.some((g) => g.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        .slice(0, 5)
    : [];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#090909]/95 backdrop-blur-md shadow-2xl border-b border-white/5'
          : 'bg-gradient-to-b from-[#090909]/90 via-[#090909]/40 to-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Brand Logo & Main Nav */}
          <div className="flex items-center gap-6 lg:gap-10">
            {/* Logo */}
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2.5 text-left focus:outline-none group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-md bg-[#E50914] flex items-center justify-center shadow-lg shadow-red-950/50 group-hover:scale-105 transition-transform">
                <Play className="w-5 h-5 text-white fill-white ml-0.5" />
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1 font-sans">
                  MOVIE<span className="text-[#E50914]">MART</span>
                </span>
              </div>
            </button>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-semibold">
              <button
                onClick={() => onNavigate('home')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  currentView === 'home'
                    ? 'text-white font-bold bg-white/10'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => onNavigate('movies')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  currentView === 'movies'
                    ? 'text-white font-bold bg-white/10'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Movies
              </button>
              <button
                onClick={() => onNavigate('series')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  currentView === 'series'
                    ? 'text-white font-bold bg-white/10'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Series
              </button>
              <button
                onClick={() => onNavigate('dubbed')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                  currentView === 'dubbed'
                    ? 'text-white font-bold bg-white/10'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <Languages className="w-3.5 h-3.5 text-amber-400" />
                <span>Dubbed</span>
              </button>
              <button
                onClick={() => onNavigate('my-list')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                  currentView === 'my-list'
                    ? 'text-white font-bold bg-white/10'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <span>My List</span>
                {watchlistCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-[#E50914] text-[10px] text-white font-bold">
                    {watchlistCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => onNavigate('admin')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                  currentView === 'admin'
                    ? 'text-white font-bold bg-white/10'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                <span>Admin</span>
              </button>
            </nav>
          </div>

          {/* Right Action Icons & 24h Pass */}
          <div className="flex items-center gap-3">
            
            {/* Search Input */}
            <div className="relative">
              <div className="flex items-center">
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="p-2 text-gray-300 hover:text-white transition-colors cursor-pointer"
                  title="Search"
                >
                  <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {isSearchOpen && (
                  <div className="relative">
                    <input
                      type="text"
                      autoFocus
                      value={searchQuery}
                      onChange={(e) => {
                        onSearchChange(e.target.value);
                        setShowSuggestions(true);
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      placeholder="Titles, genres, actors..."
                      className="w-44 sm:w-64 bg-[#181818] border border-white/20 rounded-full pl-3 pr-8 py-1.5 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-[#E50914] transition-all"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => {
                          onSearchChange('');
                          setShowSuggestions(false);
                        }}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Autocomplete Suggestion Dropdown */}
              {isSearchOpen && showSuggestions && searchSuggestions.length > 0 && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowSuggestions(false)}
                  />
                  <div className="absolute right-0 mt-2 w-72 bg-[#181818] border border-white/15 rounded-xl shadow-2xl overflow-hidden z-20 divide-y divide-white/10">
                    <div className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Matches ({searchSuggestions.length})
                    </div>
                    {searchSuggestions.map((title) => (
                      <button
                        key={title.id}
                        onClick={() => {
                          onSelectTitle(title);
                          setShowSuggestions(false);
                          setIsSearchOpen(false);
                        }}
                        className="w-full px-3 py-2.5 flex items-center gap-3 hover:bg-white/10 text-left transition-colors cursor-pointer"
                      >
                        <img
                          src={title.poster_url}
                          alt={title.title}
                          className="w-8 h-12 object-cover rounded flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-white truncate">{title.title}</p>
                          <p className="text-[10px] text-gray-400">{title.release_year} • {title.genres.join(', ')}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* 24-Hour Ad-Free Pass Button / Countdown Pill */}
            {adPassStatus.hasActivePass ? (
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-bold shadow-lg"
                title="Active 24-Hour Ad-Free Pass"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span className="hidden sm:inline">Ad-Free:</span>
                <span className="font-mono text-[11px] text-white">{countdownText || 'Active'}</span>
              </div>
            ) : (
              <button
                onClick={onOpenRewardModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E50914] hover:bg-red-600 text-white text-xs font-bold shadow-lg shadow-red-950/50 transition-all hover:scale-105 cursor-pointer"
                title="Unlock 24 Hours of Ad-Free Streaming"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden sm:inline">24h Ad-Free Pass</span>
                <span className="sm:hidden">Pass</span>
              </button>
            )}

            {/* Role switch toggle (Viewer vs Admin) */}
            <button
              onClick={onToggleRole}
              className={`p-1.5 sm:px-2.5 sm:py-1 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                currentUserRole === 'admin'
                  ? 'bg-red-950/50 border-red-500 text-red-300'
                  : 'bg-white/5 border-white/10 text-gray-300 hover:text-white'
              }`}
              title="Toggle Viewer / Administrator Role"
            >
              <User className="w-3.5 h-3.5" />
              <span className="hidden md:inline uppercase text-[10px]">
                {currentUserRole}
              </span>
            </button>

          </div>

        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex md:hidden items-center justify-between py-2 border-t border-white/10 overflow-x-auto gap-2">
          <button
            onClick={() => onNavigate('home')}
            className={`px-3 py-1 rounded text-xs font-semibold whitespace-nowrap ${
              currentView === 'home' ? 'text-white bg-white/15' : 'text-gray-400'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => onNavigate('movies')}
            className={`px-3 py-1 rounded text-xs font-semibold whitespace-nowrap ${
              currentView === 'movies' ? 'text-white bg-white/15' : 'text-gray-400'
            }`}
          >
            Movies
          </button>
          <button
            onClick={() => onNavigate('series')}
            className={`px-3 py-1 rounded text-xs font-semibold whitespace-nowrap ${
              currentView === 'series' ? 'text-white bg-white/15' : 'text-gray-400'
            }`}
          >
            Series
          </button>
          <button
            onClick={() => onNavigate('dubbed')}
            className={`px-3 py-1 rounded text-xs font-semibold whitespace-nowrap ${
              currentView === 'dubbed' ? 'text-white bg-white/15' : 'text-gray-400'
            }`}
          >
            Dubbed
          </button>
          <button
            onClick={() => onNavigate('my-list')}
            className={`px-3 py-1 rounded text-xs font-semibold whitespace-nowrap ${
              currentView === 'my-list' ? 'text-white bg-white/15' : 'text-gray-400'
            }`}
          >
            My List ({watchlistCount})
          </button>
          <button
            onClick={() => onNavigate('admin')}
            className={`px-3 py-1 rounded text-xs font-semibold whitespace-nowrap ${
              currentView === 'admin' ? 'text-white bg-white/15' : 'text-gray-400'
            }`}
          >
            Admin
          </button>
        </div>

      </div>
    </header>
  );
};
