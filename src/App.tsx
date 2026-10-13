import React, { useState, useEffect, useMemo } from 'react';
import { 
  Play, 
  Film, 
  Tv, 
  Bookmark, 
  Search, 
  Sparkles, 
  AlertCircle, 
  Clock, 
  SlidersHorizontal 
} from 'lucide-react';
import { Title, StreamingSource, AdFreePassStatus, WatchProgress } from './types/ott';
import { Navbar } from './components/ott/Navbar';
import { HeroBanner } from './components/ott/HeroBanner';
import { MovieRail } from './components/ott/MovieRail';
import { VideoPlayerModal } from './components/ott/VideoPlayerModal';
import { FirstPlayAdModal } from './components/ott/FirstPlayAdModal';
import { AdRewardModal } from './components/ott/AdRewardModal';
import { TitleDetailModal } from './components/ott/TitleDetailModal';
import { AdminDashboard } from './components/ott/AdminDashboard';
import { DmcaModal } from './components/ott/DmcaModal';
import { Footer } from './components/ott/Footer';

export const App: React.FC = () => {
  // Navigation & View
  const [currentView, setCurrentView] = useState<'home' | 'movies' | 'series' | 'dubbed' | 'my-list' | 'admin' | 'search'>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentUserRole, setCurrentRole] = useState<'user' | 'admin'>('user');

  // Catalog State
  const [titles, setTitles] = useState<Title[]>([]);
  const [featuredTitle, setFeaturedTitle] = useState<Title | null>(null);
  const [watchlist, setWatchlist] = useState<Title[]>([]);
  const [progressList, setProgressList] = useState<WatchProgress[]>([]);
  const [adPassStatus, setAdPassStatus] = useState<AdFreePassStatus>({ hasActivePass: false, remainingSeconds: 0 });
  const [isLoadingCatalog, setIsLoadingCatalog] = useState<boolean>(true);

  // Modals & Player State
  const [playingTitle, setPlayingTitle] = useState<Title | null>(null);
  const [activeSources, setActiveSources] = useState<StreamingSource[]>([]);
  const [firstPlayAdTitle, setFirstPlayAdTitle] = useState<Title | null>(null);
  const [isRewardModalOpen, setIsRewardModalOpen] = useState<boolean>(false);
  const [detailTitle, setDetailTitle] = useState<Title | null>(null);
  const [detailSources, setDetailSources] = useState<StreamingSource[]>([]);
  const [isDmcaModalOpen, setIsDmcaModalOpen] = useState<boolean>(false);
  const [dmcaTitle, setDmcaTitle] = useState<Title | null>(null);

  // Filtering state in sub-views
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'newest'>('popular');

  const userId = 'demo-user-1';

  // Fetch initial catalog, featured title, and pass status
  const loadCatalogData = async () => {
    try {
      const [titlesRes, featRes, watchRes, progRes, passRes] = await Promise.all([
        fetch('/api/titles'),
        fetch('/api/titles/featured'),
        fetch(`/api/watchlist?userId=${userId}`),
        fetch(`/api/watch-progress?userId=${userId}`),
        fetch(`/api/ads/pass-status?userId=${userId}`),
      ]);

      const titlesData = await titlesRes.json();
      const featData = await featRes.json();
      const watchData = await watchRes.json();
      const progData = await progRes.json();
      const passData = await passRes.json();

      if (titlesData.success) setTitles(titlesData.titles);
      if (featData.success) setFeaturedTitle(featData.title);
      if (watchData.success) setWatchlist(watchData.watchlist);
      if (progData.success) setProgressList(progData.progress);
      if (passData.success) setAdPassStatus(passData);
    } catch (err) {
      console.error('Failed to load MovieMart catalog:', err);
    } finally {
      setIsLoadingCatalog(false);
    }
  };

  useEffect(() => {
    loadCatalogData();
  }, []);

  // Watchlist IDs set
  const watchlistIds = useMemo(() => watchlist.map((t) => t.id), [watchlist]);

  // Progress Map: titleId -> percentage
  const progressMap = useMemo(() => {
    const map: Record<string, number> = {};
    progressList.forEach((p) => {
      map[p.title_id] = p.percentage;
    });
    return map;
  }, [progressList]);

  // Handle Watchlist Toggle
  const handleToggleWatchlist = async (title: Title) => {
    try {
      const res = await fetch('/api/watchlist/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, titleId: title.id }),
      });
      const data = await res.json();
      if (data.success) {
        if (data.isSaved) {
          setWatchlist((prev) => [...prev, title]);
        } else {
          setWatchlist((prev) => prev.filter((t) => t.id !== title.id));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Watch Progress Save
  const handleSaveProgress = async (titleId: string, progressSeconds: number, durationSeconds: number) => {
    try {
      const res = await fetch('/api/watch-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, titleId, progressSeconds, durationSeconds }),
      });
      const data = await res.json();
      if (data.success && data.record) {
        setProgressList((prev) => {
          const filtered = prev.filter((p) => p.title_id !== titleId);
          return [data.record, ...filtered];
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch sources and trigger playback (with pre-roll ad check)
  const handleWatchNow = async (title: Title) => {
    try {
      const res = await fetch(`/api/sources/${title.id}`);
      const data = await res.json();
      const sources: StreamingSource[] = data.success ? data.sources : [];

      setActiveSources(sources);

      // Check if user has active 24-hour Ad-Free Pass
      // If pass is NOT active, show disclosed compliant first-play pre-roll ad
      if (!adPassStatus.hasActivePass) {
        setFirstPlayAdTitle(title);
      } else {
        setPlayingTitle(title);
      }
    } catch (err) {
      console.error(err);
      setActiveSources([]);
      setPlayingTitle(title);
    }
  };

  // Open Details Modal
  const handleOpenDetails = async (title: Title) => {
    try {
      const res = await fetch(`/api/sources/${title.id}`);
      const data = await res.json();
      setDetailSources(data.success ? data.sources : []);
    } catch {
      setDetailSources([]);
    }
    setDetailTitle(title);
  };

  // Filtered Titles for Rail Categories
  const trendingTitles = useMemo(() => titles.filter((t) => t.is_trending), [titles]);
  const popularSeries = useMemo(() => titles.filter((t) => t.type === 'series'), [titles]);
  const publicDomainClassics = useMemo(() => titles.filter((t) => t.is_public_domain), [titles]);
  const hindiDubbed = useMemo(() => titles.filter((t) => t.region_category === 'hindi_dubbed' || t.languages.some((l) => l.code === 'hi' && l.isDubbed)), [titles]);
  const nepaliMovies = useMemo(() => titles.filter((t) => t.region_category === 'nepali'), [titles]);
  const koreanSeries = useMemo(() => titles.filter((t) => t.region_category === 'korean'), [titles]);
  const animeTitles = useMemo(() => titles.filter((t) => t.region_category === 'anime'), [titles]);
  const englishMovies = useMemo(() => titles.filter((t) => t.region_category === 'hollywood' && t.type === 'movie'), [titles]);

  // Continue Watching Titles
  const continueWatchingTitles = useMemo(() => {
    return progressList
      .map((p) => titles.find((t) => t.id === p.title_id))
      .filter((t): t is Title => !!t);
  }, [progressList, titles]);

  // Search Results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return titles.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.synopsis.toLowerCase().includes(q) ||
        t.genres.some((g) => g.toLowerCase().includes(q))
    );
  }, [titles, searchQuery]);

  // Sub-view filtered list (Movies / Series / Dubbed)
  const subviewTitles = useMemo(() => {
    let list = titles;
    if (currentView === 'movies') list = list.filter((t) => t.type === 'movie');
    if (currentView === 'series') list = list.filter((t) => t.type === 'series');
    if (currentView === 'dubbed') list = list.filter((t) => t.region_category === 'hindi_dubbed' || t.region_category === 'nepali');

    if (selectedGenre !== 'All') {
      list = list.filter((t) => t.genres.includes(selectedGenre));
    }

    if (sortBy === 'rating') {
      return [...list].sort((a, b) => b.mart_rating - a.mart_rating);
    } else if (sortBy === 'newest') {
      return [...list].sort((a, b) => b.release_year - a.release_year);
    }
    return list;
  }, [titles, currentView, selectedGenre, sortBy]);

  // All Genres in catalog
  const availableGenres = useMemo(() => {
    const set = new Set<string>();
    titles.forEach((t) => t.genres.forEach((g) => set.add(g)));
    return ['All', ...Array.from(set)];
  }, [titles]);

  return (
    <div className="min-h-screen bg-[#090909] text-gray-200 flex flex-col font-sans selection:bg-[#E50914] selection:text-white">
      
      {/* Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          setSelectedGenre('All');
        }}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          if (q.trim() && currentView !== 'search') setCurrentView('search');
          if (!q.trim() && currentView === 'search') setCurrentView('home');
        }}
        allTitles={titles}
        onSelectTitle={handleOpenDetails}
        watchlistCount={watchlist.length}
        adPassStatus={adPassStatus}
        onOpenRewardModal={() => setIsRewardModalOpen(true)}
        currentUserRole={currentUserRole}
        onToggleRole={() => setCurrentRole((r) => (r === 'user' ? 'admin' : 'user'))}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full pt-16 sm:pt-20">
        
        {/* VIEW 1: HOME (Netflix-Style Cinematic Rails) */}
        {currentView === 'home' && (
          <div className="space-y-4">
            {/* Grand Hero Spotlight */}
            {featuredTitle && (
              <HeroBanner
                title={featuredTitle}
                onWatchNow={handleWatchNow}
                onMoreInfo={handleOpenDetails}
                isInWatchlist={watchlistIds.includes(featuredTitle.id)}
                onToggleWatchlist={handleToggleWatchlist}
              />
            )}

            {/* Rail 0: Continue Watching (Personalized user progress) */}
            {continueWatchingTitles.length > 0 && (
              <MovieRail
                title="Continue Watching"
                titles={continueWatchingTitles}
                onSelectTitle={handleOpenDetails}
                onWatchNow={handleWatchNow}
                watchlistIds={watchlistIds}
                onToggleWatchlist={handleToggleWatchlist}
                progressMap={progressMap}
              />
            )}

            {/* Rail 1: Trending Movies */}
            <MovieRail
              title="Trending Movies & Blockbusters"
              titles={trendingTitles}
              onSelectTitle={handleOpenDetails}
              onWatchNow={handleWatchNow}
              watchlistIds={watchlistIds}
              onToggleWatchlist={handleToggleWatchlist}
              progressMap={progressMap}
            />

            {/* Rail 2: Popular Series */}
            <MovieRail
              title="Popular Series & TV Shows"
              titles={popularSeries}
              onSelectTitle={handleOpenDetails}
              onWatchNow={handleWatchNow}
              watchlistIds={watchlistIds}
              onToggleWatchlist={handleToggleWatchlist}
              progressMap={progressMap}
            />

            {/* Rail 3: Hindi Dubbed Movies */}
            <MovieRail
              title="Hindi Dubbed Cinema"
              titles={hindiDubbed}
              onSelectTitle={handleOpenDetails}
              onWatchNow={handleWatchNow}
              watchlistIds={watchlistIds}
              onToggleWatchlist={handleToggleWatchlist}
              progressMap={progressMap}
            />

            {/* Rail 4: Nepali Movies */}
            <MovieRail
              title="Nepali Cinema Releases"
              titles={nepaliMovies}
              onSelectTitle={handleOpenDetails}
              onWatchNow={handleWatchNow}
              watchlistIds={watchlistIds}
              onToggleWatchlist={handleToggleWatchlist}
              progressMap={progressMap}
            />

            {/* Rail 5: English Movies */}
            <MovieRail
              title="English & International Releases"
              titles={englishMovies}
              onSelectTitle={handleOpenDetails}
              onWatchNow={handleWatchNow}
              watchlistIds={watchlistIds}
              onToggleWatchlist={handleToggleWatchlist}
              progressMap={progressMap}
            />

            {/* Rail 6: Korean Series */}
            <MovieRail
              title="Korean Series & K-Drama"
              titles={koreanSeries}
              onSelectTitle={handleOpenDetails}
              onWatchNow={handleWatchNow}
              watchlistIds={watchlistIds}
              onToggleWatchlist={handleToggleWatchlist}
              progressMap={progressMap}
            />

            {/* Rail 7: Anime */}
            <MovieRail
              title="Anime & Animated Masterpieces"
              titles={animeTitles}
              onSelectTitle={handleOpenDetails}
              onWatchNow={handleWatchNow}
              watchlistIds={watchlistIds}
              onToggleWatchlist={handleToggleWatchlist}
              progressMap={progressMap}
            />

            {/* Rail 8: Public-Domain Classics */}
            <MovieRail
              title="Public-Domain Classics (Pre-1928 & Licensed)"
              titles={publicDomainClassics}
              onSelectTitle={handleOpenDetails}
              onWatchNow={handleWatchNow}
              watchlistIds={watchlistIds}
              onToggleWatchlist={handleToggleWatchlist}
              progressMap={progressMap}
            />
          </div>
        )}

        {/* VIEW 2: DEDICATED CATALOG / SUBVIEWS (Movies, Series, Dubbed) */}
        {(currentView === 'movies' || currentView === 'series' || currentView === 'dubbed') && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            
            {/* Header with Title & Filter Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white">
                  {currentView === 'movies'
                    ? 'Movies & Feature Films'
                    : currentView === 'series'
                    ? 'TV Series & Seasons'
                    : 'Hindi & Nepali Dubbed Releases'}
                </h1>
                <p className="text-xs text-gray-400 mt-1">
                  Browse {subviewTitles.length} verified records in the MovieMart catalog
                </p>
              </div>

              {/* Filter Chips & Sort */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-md">
                  {availableGenres.map((g) => (
                    <button
                      key={g}
                      onClick={() => setSelectedGenre(g)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                        selectedGenre === g
                          ? 'bg-[#E50914] text-white'
                          : 'bg-[#181818] text-gray-400 hover:text-white border border-white/10'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-[#181818] border border-white/15 rounded-lg px-2.5 py-1 text-xs text-white"
                >
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Mart Rating</option>
                  <option value="newest">Release Year</option>
                </select>
              </div>
            </div>

            {/* Grid Display */}
            {subviewTitles.length === 0 ? (
              <div className="py-20 text-center text-gray-400 bg-[#141414] rounded-2xl border border-white/5 space-y-2">
                <Film className="w-10 h-10 text-gray-600 mx-auto" />
                <h3 className="text-base font-bold text-white">No titles in this category</h3>
                <p className="text-xs text-gray-500">Try adjusting your genre filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {subviewTitles.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleOpenDetails(item)}
                    className="group bg-[#181818] rounded-xl overflow-hidden border border-white/10 hover:border-red-600/50 transition-all cursor-pointer flex flex-col hover:scale-[1.02]"
                  >
                    <div className="relative aspect-[2/3] bg-neutral-900 overflow-hidden">
                      <img
                        src={item.poster_url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute top-2 left-2">
                        {item.is_public_domain && (
                          <span className="px-1.5 py-0.5 rounded bg-amber-500 text-[9px] font-black uppercase text-black">
                            Classics
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <h4 className="font-bold text-xs text-white group-hover:text-[#E50914] truncate">
                        {item.title}
                      </h4>
                      <p className="text-[10px] text-gray-400 mt-1">
                        {item.release_year} • {item.genres[0]}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* VIEW 3: MY LIST */}
        {currentView === 'my-list' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <div className="border-b border-white/10 pb-4">
              <h1 className="text-2xl sm:text-3xl font-black text-white">My List</h1>
              <p className="text-xs text-gray-400 mt-1">
                {watchlist.length} saved title{watchlist.length !== 1 ? 's' : ''} in your private watchlist
              </p>
            </div>

            {watchlist.length === 0 ? (
              <div className="py-20 text-center text-gray-400 bg-[#141414] rounded-2xl border border-white/5 space-y-3">
                <Bookmark className="w-12 h-12 text-gray-600 mx-auto" />
                <h3 className="text-base font-bold text-white">Your list is empty</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Click "+ My List" on any movie or series to bookmark it for later.
                </p>
                <button
                  onClick={() => setCurrentView('home')}
                  className="px-4 py-2 rounded-xl bg-[#E50914] text-white font-bold text-xs cursor-pointer"
                >
                  Explore Catalog
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {watchlist.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleOpenDetails(item)}
                    className="group bg-[#181818] rounded-xl overflow-hidden border border-white/10 hover:border-red-600/50 transition-all cursor-pointer flex flex-col"
                  >
                    <div className="relative aspect-[2/3] bg-neutral-900 overflow-hidden">
                      <img
                        src={item.poster_url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <h4 className="font-bold text-xs text-white truncate">{item.title}</h4>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-[10px] text-gray-400">{item.release_year}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleWatchlist(item);
                          }}
                          className="text-[10px] text-red-400 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 4: SEARCH RESULTS */}
        {currentView === 'search' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <div className="border-b border-white/10 pb-4">
              <h1 className="text-2xl font-black text-white">
                Search Results for "{searchQuery}"
              </h1>
              <p className="text-xs text-gray-400 mt-1">
                Found {searchResults.length} match{searchResults.length !== 1 ? 'es' : ''} in catalog
              </p>
            </div>

            {searchResults.length === 0 ? (
              <div className="py-20 text-center text-gray-400 bg-[#141414] rounded-2xl border border-white/5 space-y-2">
                <Search className="w-10 h-10 text-gray-600 mx-auto" />
                <h3 className="text-base font-bold text-white">No matches found</h3>
                <p className="text-xs text-gray-500">Try searching by title or genre name.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {searchResults.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleOpenDetails(item)}
                    className="group bg-[#181818] rounded-xl overflow-hidden border border-white/10 hover:border-red-600/50 transition-all cursor-pointer flex flex-col"
                  >
                    <div className="relative aspect-[2/3] bg-neutral-900 overflow-hidden">
                      <img
                        src={item.poster_url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <h4 className="font-bold text-xs text-white truncate">{item.title}</h4>
                      <p className="text-[10px] text-gray-400 mt-1">{item.release_year} • {item.genres.join(', ')}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {/* Footer */}
      <Footer
        onOpenDmca={() => {
          setDmcaTitle(null);
          setIsDmcaModalOpen(true);
        }}
        onNavigate={(view) => setCurrentView(view)}
      />

      {/* MODALS */}

      {/* 1. Authorized Video Player Modal */}
      {playingTitle && (
        <VideoPlayerModal
          title={playingTitle}
          initialSources={activeSources}
          initialProgressSeconds={progressMap[playingTitle.id] ? (progressMap[playingTitle.id] / 100) * 5000 : 0}
          onClose={() => setPlayingTitle(null)}
          onSaveProgress={handleSaveProgress}
        />
      )}

      {/* 2. First-Play Disclosed Pre-Roll Ad Modal */}
      {firstPlayAdTitle && (
        <FirstPlayAdModal
          title={firstPlayAdTitle}
          onAdCompleted={() => {
            const t = firstPlayAdTitle;
            setFirstPlayAdTitle(null);
            setPlayingTitle(t);
          }}
          onOpenRewardPass={() => {
            setFirstPlayAdTitle(null);
            setIsRewardModalOpen(true);
          }}
          onCancel={() => setFirstPlayAdTitle(null)}
        />
      )}

      {/* 3. 24-Hour Ad-Free Reward Modal */}
      {isRewardModalOpen && (
        <AdRewardModal
          userId={userId}
          onClose={() => setIsRewardModalOpen(false)}
          onPassGranted={(status) => {
            setAdPassStatus(status);
            loadCatalogData();
          }}
        />
      )}

      {/* 4. Title Detail Modal */}
      {detailTitle && (
        <TitleDetailModal
          title={detailTitle}
          sources={detailSources}
          isInWatchlist={watchlistIds.includes(detailTitle.id)}
          onToggleWatchlist={handleToggleWatchlist}
          onWatchNow={(t) => {
            setDetailTitle(null);
            handleWatchNow(t);
          }}
          onClose={() => setDetailTitle(null)}
          onOpenDmca={(t) => {
            setDetailTitle(null);
            setDmcaTitle(t);
            setIsDmcaModalOpen(true);
          }}
        />
      )}

      {/* 5. Operations Console / Admin Dashboard */}
      {currentView === 'admin' && (
        <AdminDashboard
          onClose={() => setCurrentView('home')}
          onRefreshCatalog={loadCatalogData}
        />
      )}

      {/* 6. DMCA Infringement Report Modal */}
      {isDmcaModalOpen && (
        <DmcaModal
          title={dmcaTitle}
          onClose={() => {
            setIsDmcaModalOpen(false);
            setDmcaTitle(null);
          }}
        />
      )}

    </div>
  );
};

export default App;
