import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Ticket, Clapperboard, QrCode, CreditCard, Sparkles, Printer, Download, ArrowRight } from 'lucide-react';
import { CartItem, Booking, DigitalLicense } from '../types/movie';

interface CheckoutModalProps {
  items: CartItem[];
  appliedPromo?: { code: string; discount: number };
  onClose: () => void;
  onCompleteOrder: (
    newBookings: Booking[],
    newLicenses: DigitalLicense[]
  ) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  items,
  appliedPromo,
  onClose,
  onCompleteOrder,
}) => {
  const [step, setStep] = useState<'payment' | 'success'>('payment');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay' | 'balance'>('card');
  const [email, setEmail] = useState('cinephile@moviemart.io');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardHolder, setCardHolder] = useState('Alex Mercer');
  const [isProcessing, setIsProcessing] = useState(false);

  // Success receipts state
  const [generatedBookings, setGeneratedBookings] = useState<Booking[]>([]);
  const [generatedLicenses, setGeneratedLicenses] = useState<DigitalLicense[]>([]);

  // Computations
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = appliedPromo ? subtotal * appliedPromo.discount : 0;
  const taxes = (subtotal - discountAmount) * 0.05;
  const total = subtotal - discountAmount + taxes;

  const handlePay = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const bookings: Booking[] = [];
      const licenses: DigitalLicense[] = [];

      items.forEach((item) => {
        if (item.type === 'ticket' && item.details) {
          bookings.push({
            id: `book-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            bookingCode: `MM-${Math.floor(100000 + Math.random() * 900000)}`,
            movieId: item.movieId,
            movieTitle: item.movieTitle,
            poster: item.poster,
            theater: item.details.theater || 'IMAX Laser Dome',
            showtime: item.details.showtime || '07:00 PM',
            date: item.details.date || 'Today',
            seats: item.details.seats || ['E4'],
            snacks: item.details.snackAddons || [],
            totalAmount: item.price,
            purchasedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          });
        } else if (item.type === 'digital_buy' || item.type === 'digital_rent') {
          licenses.push({
            id: `lic-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            movieId: item.movieId,
            movieTitle: item.movieTitle,
            poster: item.poster,
            backdrop: item.poster,
            type: item.type === 'digital_buy' ? 'buy' : 'rent',
            purchasedAt: 'Today',
            expiresAt: item.type === 'digital_rent' ? 'In 48 Hours' : undefined,
            streamQuality: '4K Ultra HD • Dolby Atmos',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
          });
        }
      });

      setGeneratedBookings(bookings);
      setGeneratedLicenses(licenses);
      setIsProcessing(false);
      setStep('success');
      onCompleteOrder(bookings, licenses);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#111422] border border-white/15 rounded-3xl shadow-2xl overflow-hidden my-auto">
        
        {/* Header */}
        <div className="p-5 bg-[#161a2b] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {step === 'payment' ? 'Secure MovieMart Checkout' : 'Order Confirmed!'}
              </h2>
              <p className="text-xs text-slate-400">
                {step === 'payment' ? 'Instant contactless fulfillment' : 'Your tickets & streams are ready in My Vault'}
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

        {/* Step 1: Payment Checkout */}
        {step === 'payment' ? (
          <div className="p-6 space-y-6">
            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Payment Method
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'bg-rose-950/30 border-rose-500 text-white shadow-md'
                      : 'bg-[#171b2d] border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-rose-400 mb-1" />
                  <div className="text-xs font-bold">Credit Card</div>
                  <div className="text-[10px] text-slate-400">Visa / Mastercard</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('apple_pay')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    paymentMethod === 'apple_pay'
                      ? 'bg-rose-950/30 border-rose-500 text-white shadow-md'
                      : 'bg-[#171b2d] border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="text-xs font-black mb-1"> Pay / G-Pay</div>
                  <div className="text-xs font-bold">Express Digital</div>
                  <div className="text-[10px] text-slate-400">1-Touch Pay</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('balance')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    paymentMethod === 'balance'
                      ? 'bg-rose-950/30 border-rose-500 text-white shadow-md'
                      : 'bg-[#171b2d] border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-amber-400 mb-1" />
                  <div className="text-xs font-bold">Mart Balance</div>
                  <div className="text-[10px] text-emerald-400 font-bold">$50.00 Credits</div>
                </button>
              </div>
            </div>

            {/* Inputs */}
            <div className="space-y-3 bg-[#151928] p-4 rounded-2xl border border-white/5">
              <div>
                <label className="text-xs text-slate-400 font-semibold mb-1 block">
                  Delivery Email (For Digital Tickets & Streaming Invoices)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#1c2237] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              {paymentMethod === 'card' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 font-semibold mb-1 block">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-[#1c2237] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-rose-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 font-semibold mb-1 block">
                      Name on Card
                    </label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="w-full bg-[#1c2237] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="p-4 bg-[#141825] rounded-2xl border border-white/10 space-y-2 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>Items ({items.length})</span>
                <span className="text-white">${subtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Promo Discount ({appliedPromo?.code})</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Cinema Facilities & Taxes</span>
                <span className="text-white">${taxes.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-black text-white pt-2 border-t border-white/10">
                <span>Total Due</span>
                <span className="text-rose-400">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handlePay}
              disabled={isProcessing}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-sm shadow-xl shadow-rose-950/60 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Authorizing Payment...</span>
                </div>
              ) : (
                <span>Authorize & Unlock Passes (${total.toFixed(2)})</span>
              )}
            </button>
          </div>
        ) : (
          /* Step 2: Confirmation Passes */
          <div className="p-6 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-white">Payment Authorized & Unlocked!</h3>
              <p className="text-xs text-slate-400">
                Confirmation receipt sent to <span className="text-white font-semibold">{email}</span>
              </p>
            </div>

            {/* Display Generated Cinema Ticket Passes */}
            {generatedBookings.map((b) => (
              <div
                key={b.id}
                className="bg-gradient-to-r from-[#171b2d] to-[#1d2238] rounded-2xl p-5 border border-amber-500/30 shadow-xl space-y-4 relative overflow-hidden"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 text-[10px] font-black uppercase">
                      OFFICIAL CINEMA PASS
                    </span>
                    <h4 className="text-lg font-black text-white mt-1">{b.movieTitle}</h4>
                    <p className="text-xs text-amber-300 font-semibold">{b.theater}</p>
                    <p className="text-xs text-slate-300 mt-0.5">
                      {b.date} • {b.showtime}
                    </p>
                  </div>

                  {/* QR Code Mock */}
                  <div className="bg-white p-2 rounded-xl flex flex-col items-center flex-shrink-0">
                    <QrCode className="w-14 h-14 text-slate-950" />
                    <span className="text-[9px] font-mono text-slate-800 font-bold mt-0.5">
                      {b.bookingCode}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-black/40 rounded-xl border border-white/5 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400">Reserved Seats: </span>
                    <span className="text-white font-bold">{b.seats.join(', ')}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Booking Ref: </span>
                    <span className="text-amber-400 font-mono font-bold">{b.bookingCode}</span>
                  </div>
                </div>
              </div>
            ))}

            {/* Display Unlocked Digital Streams */}
            {generatedLicenses.map((lic) => (
              <div
                key={lic.id}
                className="p-4 bg-rose-950/20 border border-rose-500/30 rounded-2xl flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-600/30 text-rose-400 flex items-center justify-center flex-shrink-0">
                    <Clapperboard className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{lic.movieTitle}</h4>
                    <span className="text-xs text-rose-300 font-semibold">
                      {lic.type === 'buy' ? 'Lifetime 4K License Unlocked' : '48-Hour Rental Activated'}
                    </span>
                  </div>
                </div>

                <span className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                  Ready in Vault
                </span>
              </div>
            ))}

            {/* Done button */}
            <div className="pt-2">
              <button
                onClick={onClose}
                className="w-full py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-lg shadow-rose-950/50 transition-all cursor-pointer"
              >
                Done • View In My Vault
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
