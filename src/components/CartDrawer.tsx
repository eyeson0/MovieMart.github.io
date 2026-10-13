import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, Ticket, Clapperboard, Package, ShieldCheck } from 'lucide-react';
import { CartItem } from '../types/movie';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemoveItem: (id: string) => void;
  onProceedToCheckout: (appliedPromo?: { code: string; discount: number }) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState<{ code: string; discount: number } | null>(null);
  const [promoError, setPromoError] = useState('');

  if (!isOpen) return null;

  const handleApplyPromo = () => {
    setPromoError('');
    const code = promoCode.trim().toUpperCase();
    if (code === 'MARTOFFER' || code === 'MART15') {
      setPromoApplied({ code, discount: 0.15 }); // 15% off
    } else if (code === 'CINEMA10' || code === 'VIP10') {
      setPromoApplied({ code, discount: 0.10 }); // 10% off
    } else {
      setPromoError('Invalid promo code. Try MARTOFFER');
    }
  };

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = promoApplied ? subtotal * promoApplied.discount : 0;
  const taxes = (subtotal - discountAmount) * 0.05; // 5% tax
  const total = subtotal - discountAmount + taxes;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer content */}
      <div className="relative w-full max-w-md bg-[#10131f] border-l border-white/10 h-full shadow-2xl flex flex-col z-10">
        
        {/* Header */}
        <div className="p-5 bg-[#151928] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-600/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Your Cinema Cart</h2>
              <p className="text-xs text-slate-400">{items.length} item{items.length !== 1 ? 's' : ''}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 py-12">
              <ShoppingBag className="w-16 h-16 text-slate-600 mb-4 stroke-[1.5]" />
              <p className="text-base font-bold text-slate-300">Your cart is empty</p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Explore theater screenings, 4K digital streams, and collector editions to add to your cart.
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="p-3.5 bg-[#151928] rounded-2xl border border-white/10 flex gap-3.5 items-start"
              >
                <img
                  src={item.poster}
                  alt={item.movieTitle}
                  className="w-14 h-20 rounded-xl object-cover flex-shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-bold text-white leading-snug">
                      {item.movieTitle}
                    </h4>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-slate-500 hover:text-rose-400 transition-colors p-1 cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Format tag */}
                  <div className="mt-1 flex items-center gap-1.5">
                    {item.type === 'ticket' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                        <Ticket className="w-3 h-3" /> Theater Pass
                      </span>
                    ) : item.type === 'digital_buy' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-600/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold">
                        <Clapperboard className="w-3 h-3" /> 4K UHD Purchase
                      </span>
                    ) : item.type === 'digital_rent' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[10px] font-bold">
                        <Clapperboard className="w-3 h-3" /> 48h Rental
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold">
                        <Package className="w-3 h-3" /> Merch
                      </span>
                    )}
                  </div>

                  {/* Details info */}
                  {item.details && (
                    <div className="mt-2 text-xs text-slate-300 space-y-0.5">
                      {item.details.theater && (
                        <div className="truncate text-slate-400">
                          {item.details.theater}
                        </div>
                      )}
                      {item.details.showtime && (
                        <div>
                          {item.details.date} • {item.details.showtime}
                        </div>
                      )}
                      {item.details.seats && item.details.seats.length > 0 && (
                        <div className="text-amber-400 font-semibold">
                          Seats: {item.details.seats.join(', ')}
                        </div>
                      )}
                      {item.details.editionName && (
                        <div className="text-slate-300">{item.details.editionName}</div>
                      )}
                    </div>
                  )}

                  <div className="mt-2 text-right">
                    <span className="text-sm font-black text-rose-400">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with Promo & Total */}
        {items.length > 0 && (
          <div className="p-5 bg-[#151928] border-t border-white/10 space-y-4">
            
            {/* Promo Code Input */}
            <div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Promo code (e.g. MARTOFFER)"
                    className="w-full bg-[#1c2237] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white uppercase placeholder-slate-500 focus:outline-none focus:border-rose-500 font-medium"
                  />
                </div>
                <button
                  onClick={handleApplyPromo}
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </div>
              {promoError && (
                <p className="text-[11px] text-rose-400 mt-1">{promoError}</p>
              )}
              {promoApplied && (
                <p className="text-[11px] text-emerald-400 mt-1 font-semibold">
                  ✓ Promo applied: {promoApplied.code} ({(promoApplied.discount * 100).toFixed(0)}% OFF)
                </p>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-slate-400 border-t border-white/5 pt-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white">${subtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Taxes & Cinema Fees</span>
                <span className="text-white">${taxes.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-black text-white pt-2 border-t border-white/10">
                <span>Total Amount</span>
                <span className="text-rose-400">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => onProceedToCheckout(promoApplied || undefined)}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-sm shadow-xl shadow-rose-950/60 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Proceed to Secure Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Instant digital fulfillment & contactless QR passes</span>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
