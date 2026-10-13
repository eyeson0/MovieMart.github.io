import React, { useState } from 'react';
import { X, Ticket, Calendar, Clock, MapPin, Check, Plus, Minus, Popcorn, Sparkles, ShieldCheck } from 'lucide-react';
import { Movie, SnackItem, CartItem } from '../types/movie';
import { THEATER_SHOWTIMES, THEATER_DATES, SNACKS_MENU } from '../data/mockMovies';

interface CinemaTicketModalProps {
  movie: Movie;
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
  onDirectCheckout: (item: CartItem) => void;
}

// Generate sample seat layout
const ROWS = ['A', 'B', 'C', 'D', 'E', 'F'];
const SEATS_PER_ROW = 8;
const PRE_OCCUPIED_SEATS = ['B3', 'B4', 'C5', 'C6', 'D2', 'D7', 'E1'];

export const CinemaTicketModal: React.FC<CinemaTicketModalProps> = ({
  movie,
  onClose,
  onAddToCart,
  onDirectCheckout,
}) => {
  const theaters = movie.theatersAvailable || ['IMAX Laser Dome - Grand Central', 'Dolby Cinema 8 - Metropolis'];
  const [selectedTheater, setSelectedTheater] = useState(theaters[0]);
  const [selectedDate, setSelectedDate] = useState(THEATER_DATES[0].date);
  const [selectedShowtime, setSelectedShowtime] = useState(THEATER_SHOWTIMES[2]); // 06:30 PM
  const [selectedSeats, setSelectedSeats] = useState<string[]>(['E4', 'E5']);
  const [snackQuantities, setSnackQuantities] = useState<Record<string, number>>({});

  const standardTicketPrice = movie.theaterTicketPrice || 16.50;
  const vipTicketPrice = standardTicketPrice + 5.50;

  const toggleSeat = (seatId: string) => {
    if (PRE_OCCUPIED_SEATS.includes(seatId)) return;
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const updateSnackQty = (snackId: string, delta: number) => {
    setSnackQuantities((prev) => {
      const current = prev[snackId] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [snackId]: next };
    });
  };

  // Calculate totals
  const ticketSubtotal = selectedSeats.reduce((acc, seat) => {
    const isVip = seat.startsWith('E') || seat.startsWith('F');
    return acc + (isVip ? vipTicketPrice : standardTicketPrice);
  }, 0);

  const snacksSubtotal = Object.entries(snackQuantities).reduce((acc, [id, qty]) => {
    const item = SNACKS_MENU.find((s) => s.id === id);
    return acc + (item ? item.price * qty : 0);
  }, 0);

  const total = ticketSubtotal + snacksSubtotal;

  const handleCreateOrder = (isDirect: boolean) => {
    if (selectedSeats.length === 0) return;

    const snackAddons = Object.entries(snackQuantities)
      .filter(([_, qty]) => qty > 0)
      .map(([id, qty]) => {
        const item = SNACKS_MENU.find((s) => s.id === id)!;
        return {
          name: item.name,
          price: item.price,
          quantity: qty,
        };
      });

    const cartItem: CartItem = {
      id: `ticket-${movie.id}-${Date.now()}`,
      type: 'ticket',
      movieId: movie.id,
      movieTitle: movie.title,
      poster: movie.poster,
      price: total,
      quantity: 1,
      details: {
        theater: selectedTheater,
        showtime: selectedShowtime,
        date: selectedDate,
        seats: selectedSeats,
        snackAddons,
      },
    };

    if (isDirect) {
      onDirectCheckout(cartItem);
    } else {
      onAddToCart(cartItem);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#10131e] border border-white/15 rounded-3xl shadow-2xl overflow-hidden my-auto">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#161a29] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                Book Cinema Experience
              </h2>
              <p className="text-xs text-slate-400">
                {movie.title} • {movie.specs.resolution} • {movie.specs.audio}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Step 1: Venue, Date, Showtime Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Theater selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                Select Theater
              </label>
              <select
                value={selectedTheater}
                onChange={(e) => setSelectedTheater(e.target.value)}
                className="w-full bg-[#181d2e] border border-white/15 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white font-medium focus:outline-none focus:border-rose-500"
              >
                {theaters.map((t) => (
                  <option key={t} value={t} className="bg-[#181d2e] text-white">
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Date selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                Select Date
              </label>
              <div className="flex gap-1.5 overflow-x-auto pb-1">
                {THEATER_DATES.map((d) => (
                  <button
                    key={d.date}
                    onClick={() => setSelectedDate(d.date)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      selectedDate === d.date
                        ? 'bg-rose-600 text-white shadow-md'
                        : 'bg-[#181d2e] text-slate-400 hover:text-white border border-white/5'
                    }`}
                  >
                    <div>{d.label}</div>
                    <div className="text-[10px] font-normal opacity-80">{d.date}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Showtime selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-sky-400" />
                Select Showtime
              </label>
              <div className="flex flex-wrap gap-1.5">
                {THEATER_SHOWTIMES.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedShowtime(time)}
                    className={`px-2.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedShowtime === time
                        ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                        : 'bg-[#181d2e] text-slate-300 hover:text-white border border-white/5'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Step 2: Interactive Cinema Seat Layout */}
          <div className="bg-[#141824] rounded-2xl p-5 border border-white/10">
            <div className="text-center mb-6">
              {/* Screen projection visual */}
              <div className="relative mx-auto max-w-md h-3.5 bg-gradient-to-r from-rose-500/20 via-sky-400 to-rose-500/20 rounded-full shadow-[0_10px_25px_rgba(56,189,248,0.3)] mb-2" />
              <span className="text-[11px] font-bold text-slate-400 tracking-widest uppercase">
                CINEMA SCREEN (DOLBY VISION LASER)
              </span>
            </div>

            {/* Seat Map */}
            <div className="flex flex-col items-center gap-2 overflow-x-auto py-2">
              {ROWS.map((row) => (
                <div key={row} className="flex items-center gap-2">
                  <span className="w-5 text-center text-xs font-bold text-slate-400">{row}</span>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {Array.from({ length: SEATS_PER_ROW }).map((_, idx) => {
                      const seatNumber = `${row}${idx + 1}`;
                      const isOccupied = PRE_OCCUPIED_SEATS.includes(seatNumber);
                      const isSelected = selectedSeats.includes(seatNumber);
                      const isVip = row === 'E' || row === 'F';

                      return (
                        <button
                          key={seatNumber}
                          disabled={isOccupied}
                          onClick={() => toggleSeat(seatNumber)}
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-[10px] font-bold flex items-center justify-center transition-all cursor-pointer ${
                            isOccupied
                              ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-white/5'
                              : isSelected
                              ? 'bg-amber-400 text-slate-950 scale-105 shadow-md shadow-amber-400/40 ring-2 ring-amber-300'
                              : isVip
                              ? 'bg-indigo-950/80 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-700/50'
                              : 'bg-white/10 text-slate-300 hover:bg-white/20 border border-white/10'
                          }`}
                          title={`${seatNumber} - ${isVip ? `VIP Recliner ($${vipTicketPrice.toFixed(2)})` : `Standard ($${standardTicketPrice.toFixed(2)})`}`}
                        >
                          {idx + 1}
                        </button>
                      );
                    })}
                  </div>
                  <span className="w-5 text-center text-xs font-bold text-slate-400">{row}</span>
                </div>
              ))}
            </div>

            {/* Seat legend */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 pt-5 text-xs text-slate-400 border-t border-white/5 mt-4">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded bg-white/10 border border-white/20" />
                <span>Standard (${standardTicketPrice.toFixed(2)})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded bg-indigo-950 border border-indigo-500/40" />
                <span>VIP Recliner (${vipTicketPrice.toFixed(2)})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded bg-amber-400" />
                <span className="text-white font-semibold">Selected ({selectedSeats.length})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded bg-slate-800" />
                <span>Occupied</span>
              </div>
            </div>
          </div>

          {/* Step 3: Concessions / Snack Add-ons */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Popcorn className="w-4 h-4 text-amber-400" />
                Concession Stand Add-ons (Delivered to Your Seat)
              </label>
              <span className="text-xs text-rose-400 font-medium">Freshly Prepared</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {SNACKS_MENU.slice(0, 3).map((snack) => {
                const count = snackQuantities[snack.id] || 0;
                return (
                  <div
                    key={snack.id}
                    className="p-3 bg-[#151927] border border-white/10 rounded-xl flex items-center justify-between gap-3"
                  >
                    <img
                      src={snack.image}
                      alt={snack.name}
                      className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{snack.name}</h4>
                      <div className="text-xs font-semibold text-amber-400 mt-0.5">
                        ${snack.price.toFixed(2)}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 bg-black/40 rounded-lg p-1 border border-white/10">
                      <button
                        onClick={() => updateSnackQty(snack.id, -1)}
                        disabled={count === 0}
                        className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-5 text-center text-xs font-bold text-white">
                        {count}
                      </span>
                      <button
                        onClick={() => updateSnackQty(snack.id, 1)}
                        className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-white cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer with Subtotal & CTAs */}
        <div className="p-5 sm:p-6 bg-[#161a29] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-xs text-slate-400">
              Selected Seats: <span className="font-bold text-white">{selectedSeats.join(', ') || 'None'}</span>
            </div>
            <div className="text-xl font-black text-white flex items-center gap-2">
              <span>Total:</span>
              <span className="text-rose-400">${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => handleCreateOrder(false)}
              disabled={selectedSeats.length === 0}
              className="flex-1 sm:flex-initial px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/15 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Add to Cart
            </button>
            <button
              onClick={() => handleCreateOrder(true)}
              disabled={selectedSeats.length === 0}
              className="flex-1 sm:flex-initial px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-sm shadow-xl shadow-rose-950/50 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Instant Reserve Pass
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
