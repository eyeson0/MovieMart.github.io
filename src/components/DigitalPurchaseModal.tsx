import React, { useState } from 'react';
import { X, Clapperboard, Check, ShieldCheck, Film, Tv, Download, Sparkles } from 'lucide-react';
import { Movie, CartItem } from '../types/movie';

interface DigitalPurchaseModalProps {
  movie: Movie;
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
  onInstantBuy: (item: CartItem) => void;
}

export const DigitalPurchaseModal: React.FC<DigitalPurchaseModalProps> = ({
  movie,
  onClose,
  onAddToCart,
  onInstantBuy,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<'buy' | 'rent'>('buy');

  const handleAction = (isInstant: boolean) => {
    const isBuy = selectedFormat === 'buy';
    const price = isBuy ? movie.digitalBuyPrice : movie.digitalRentPrice;

    const cartItem: CartItem = {
      id: `digital-${movie.id}-${selectedFormat}-${Date.now()}`,
      type: isBuy ? 'digital_buy' : 'digital_rent',
      movieId: movie.id,
      movieTitle: movie.title,
      poster: movie.poster,
      price,
      quantity: 1,
      details: {
        editionName: isBuy ? '4K UHD Digital Lifetime License' : '48-Hour Rental Stream',
      },
    };

    if (isInstant) {
      onInstantBuy(cartItem);
    } else {
      onAddToCart(cartItem);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-[#111420] border border-white/15 rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="relative h-44 overflow-hidden">
          <img
            src={movie.backdrop}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111420] via-[#111420]/70 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-black/60 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6">
            <span className="px-2.5 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30 text-[10px] font-bold uppercase tracking-wider">
              Digital Mart Vault
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              {movie.title}
            </h2>
          </div>
        </div>

        {/* Format Selection Cards */}
        <div className="p-6 space-y-4">
          
          {/* Option 1: Buy */}
          <div
            onClick={() => setSelectedFormat('buy')}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start justify-between ${
              selectedFormat === 'buy'
                ? 'bg-rose-950/20 border-rose-500 shadow-lg shadow-rose-950/30'
                : 'bg-[#171b2a] border-white/10 hover:border-white/20'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">4K UHD Lifetime License</span>
                <span className="px-2 py-0.5 rounded bg-rose-600 text-[10px] font-bold text-white">
                  BEST VALUE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Own permanently in your vault. Stream on any device & offline download.
              </p>
              <div className="flex items-center gap-3 pt-2 text-[11px] text-slate-300">
                <span className="flex items-center gap-1 text-sky-400">
                  <Check className="w-3.5 h-3.5" /> 4K Ultra HD + HDR10
                </span>
                <span className="flex items-center gap-1 text-amber-400">
                  <Check className="w-3.5 h-3.5" /> Dolby Atmos 7.1
                </span>
              </div>
            </div>

            <div className="text-right flex-shrink-0">
              <div className="text-xl font-black text-white">
                ${movie.digitalBuyPrice.toFixed(2)}
              </div>
              <span className="text-[10px] text-slate-400 font-medium">One-time payment</span>
            </div>
          </div>

          {/* Option 2: Rent */}
          <div
            onClick={() => setSelectedFormat('rent')}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start justify-between ${
              selectedFormat === 'rent'
                ? 'bg-rose-950/20 border-rose-500 shadow-lg shadow-rose-950/30'
                : 'bg-[#171b2a] border-white/10 hover:border-white/20'
            }`}
          >
            <div className="space-y-1">
              <div className="text-sm font-bold text-white">48-Hour Rental</div>
              <p className="text-xs text-slate-400">
                Start streaming within 30 days. 48 hours to finish once playback begins.
              </p>
              <div className="flex items-center gap-3 pt-2 text-[11px] text-slate-300">
                <span className="flex items-center gap-1 text-slate-300">
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> Full HD / 4K Stream
                </span>
              </div>
            </div>

            <div className="text-right flex-shrink-0">
              <div className="text-xl font-black text-white">
                ${movie.digitalRentPrice.toFixed(2)}
              </div>
              <span className="text-[10px] text-slate-400 font-medium">48h window</span>
            </div>
          </div>

          {/* Tech Specs overview */}
          <div className="p-3.5 bg-[#141824] rounded-xl border border-white/5 grid grid-cols-2 gap-2 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Tv className="w-4 h-4 text-rose-400" />
              <span>Apple TV, Roku, Google TV, Web</span>
            </div>
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Offline Mobile Viewing</span>
            </div>
          </div>

        </div>

        {/* Footer CTAs */}
        <div className="p-6 bg-[#161a29] border-t border-white/10 flex items-center justify-between gap-3">
          <button
            onClick={() => handleAction(false)}
            className="flex-1 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/10 transition-colors cursor-pointer"
          >
            Add to Cart
          </button>
          <button
            onClick={() => handleAction(true)}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-sm shadow-xl shadow-rose-950/50 transition-colors cursor-pointer"
          >
            Instant Unlock & Play
          </button>
        </div>

      </div>
    </div>
  );
};
