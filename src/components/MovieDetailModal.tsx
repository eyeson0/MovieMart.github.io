import React, { useState } from 'react';
import { X, Play, Ticket, Clapperboard, Star, Bookmark, Check, Plus, Package, MessageSquare, Send, Sparkles } from 'lucide-react';
import { Movie, CartItem, Review } from '../types/movie';

interface MovieDetailModalProps {
  movie: Movie;
  onClose: () => void;
  onPlayTrailer: (movie: Movie) => void;
  onBookTickets: (movie: Movie) => void;
  onOpenDigital: (movie: Movie) => void;
  onAddToCart: (item: CartItem) => void;
  isInWatchlist: boolean;
  onToggleWatchlist: (movie: Movie) => void;
  onAddReview: (movieId: string, review: Review) => void;
}

export const MovieDetailModal: React.FC<MovieDetailModalProps> = ({
  movie,
  onClose,
  onPlayTrailer,
  onBookTickets,
  onOpenDigital,
  onAddToCart,
  isInWatchlist,
  onToggleWatchlist,
  onAddReview,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'merch' | 'reviews'>('overview');
  
  // Review form state
  const [newAuthor, setNewAuthor] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newComment.trim()) return;

    const review: Review = {
      id: `rev-${Date.now()}`,
      author: newAuthor.trim(),
      rating: newRating,
      date: 'Just now',
      comment: newComment.trim(),
      likes: 1,
    };

    onAddReview(movie.id, review);
    setNewAuthor('');
    setNewComment('');
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 3000);
  };

  const handleAddMerch = (merchItem: any) => {
    onAddToCart({
      id: `merch-${merchItem.id}-${Date.now()}`,
      type: 'merch',
      movieId: movie.id,
      movieTitle: movie.title,
      poster: merchItem.image,
      price: merchItem.price,
      quantity: 1,
      details: {
        editionName: merchItem.name,
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#10131e] border border-white/15 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
        
        {/* Backdrop Banner Header */}
        <div className="relative h-64 sm:h-80 overflow-hidden flex-shrink-0">
          <img
            src={movie.backdrop}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#10131e] via-[#10131e]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#10131e]/90 via-transparent to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-black/60 text-slate-300 hover:text-white transition-colors cursor-pointer z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Banner Details */}
          <div className="absolute bottom-6 left-6 right-6 flex items-end gap-6">
            <img
              src={movie.poster}
              alt={movie.title}
              className="hidden sm:block w-32 h-48 object-cover rounded-2xl border-2 border-white/20 shadow-2xl flex-shrink-0"
            />
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded bg-rose-600 text-white text-xs font-bold uppercase">
                  {movie.ageRating}
                </span>
                <span className="text-xs text-slate-300 font-medium">
                  {movie.duration} • {movie.year}
                </span>
                <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-semibold">
                  {movie.specs.resolution}
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white font-['Cinzel']">
                {movie.title}
              </h1>
              <p className="text-amber-400 text-xs sm:text-sm font-semibold italic">
                "{movie.tagline}"
              </p>
            </div>
          </div>
        </div>

        {/* Tab Switcher & Quick CTAs */}
        <div className="px-6 py-3 bg-[#151928] border-b border-white/10 flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Overview & Specs
            </button>
            <button
              onClick={() => setActiveTab('merch')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'merch'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Package className="w-4 h-4" />
              Collectibles ({movie.merchandise?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'reviews'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Reviews ({movie.reviews.length})
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPlayTrailer(movie)}
              className="px-3.5 py-2 rounded-xl bg-white text-slate-950 font-bold text-xs flex items-center gap-1.5 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-slate-950" />
              <span>Trailer</span>
            </button>

            {movie.hasTheater && (
              <button
                onClick={() => {
                  onClose();
                  onBookTickets(movie);
                }}
                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Ticket className="w-3.5 h-3.5" />
                <span>Tickets (${movie.theaterTicketPrice})</span>
              </button>
            )}

            <button
              onClick={() => {
                onClose();
                onOpenDigital(movie);
              }}
              className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Clapperboard className="w-3.5 h-3.5" />
              <span>4K Store (${movie.digitalBuyPrice})</span>
            </button>

            <button
              onClick={() => onToggleWatchlist(movie)}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isInWatchlist
                  ? 'bg-rose-600/30 border-rose-500 text-rose-400'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isInWatchlist ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Synopsis */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Storyline
                </h3>
                <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                  {movie.synopsis}
                </p>
              </div>

              {/* Specs & Info Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-[#141825] border border-white/10">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Director</div>
                  <div className="text-sm font-bold text-white mt-0.5">{movie.director}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Genres</div>
                  <div className="text-sm font-semibold text-rose-400 mt-0.5">
                    {movie.genres.join(', ')}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Audio Format</div>
                  <div className="text-sm font-semibold text-white mt-0.5">{movie.specs.audio}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Aspect Ratio</div>
                  <div className="text-sm font-semibold text-white mt-0.5">{movie.specs.aspectRatio}</div>
                </div>
              </div>

              {/* Cast */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Starring Cast
                </h3>
                <div className="flex flex-wrap gap-2">
                  {movie.cast.map((actor) => (
                    <span
                      key={actor}
                      className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-slate-200"
                    >
                      {actor}
                    </span>
                  ))}
                </div>
              </div>

              {/* Available Theaters */}
              {movie.hasTheater && (
                <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                      <Ticket className="w-4 h-4" />
                      Currently Screening In Premium Theaters
                    </h4>
                    <p className="text-xs text-slate-300 mt-1">
                      {movie.theatersAvailable?.join(' • ')}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      onBookTickets(movie);
                    }}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs whitespace-nowrap cursor-pointer"
                  >
                    Select Showtimes
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'merch' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white">
                Official MovieMart Exclusives & Collector Sets
              </h3>
              {movie.merchandise && movie.merchandise.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {movie.merchandise.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl bg-[#141825] border border-white/10 flex gap-4 items-center"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        {item.badge && (
                          <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider block">
                            {item.badge}
                          </span>
                        )}
                        <h4 className="text-sm font-bold text-white truncate">{item.name}</h4>
                        <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                          {item.description}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm font-black text-rose-400">
                            ${item.price.toFixed(2)}
                          </span>
                          <button
                            onClick={() => handleAddMerch(item)}
                            className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs cursor-pointer"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-slate-400 text-sm">
                  Collector merchandise arriving soon for this title.
                </div>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {/* Add review form */}
              <form onSubmit={handleReviewSubmit} className="p-4 rounded-2xl bg-[#141825] border border-white/10 space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-amber-400" />
                  Leave a Verified Member Review
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    className="bg-[#1a2032] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Rating:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewRating(star)}
                          className="cursor-pointer"
                        >
                          <Star
                            className={`w-4 h-4 ${
                              star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <textarea
                  required
                  rows={2}
                  placeholder="Share your thoughts on the movie, theater audio, or 4K master..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full bg-[#1a2032] border border-white/10 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />

                <div className="flex items-center justify-between">
                  {reviewSubmitted && (
                    <span className="text-xs text-emerald-400 font-medium">
                      Review posted successfully!
                    </span>
                  )}
                  <button
                    type="submit"
                    className="ml-auto px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Post Review</span>
                  </button>
                </div>
              </form>

              {/* Reviews list */}
              <div className="space-y-3">
                {movie.reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-xl bg-[#141825] border border-white/5 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{rev.author}</span>
                        <span className="text-xs text-slate-400">• {rev.date}</span>
                      </div>
                      <div className="flex gap-0.5">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {rev.comment}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
