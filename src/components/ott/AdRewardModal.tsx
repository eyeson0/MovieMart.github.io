import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  ShieldCheck, 
  Play, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Lock, 
  ArrowRight,
  Info
} from 'lucide-react';
import { AdFreePassStatus } from '../../types/ott';

interface AdRewardModalProps {
  onClose: () => void;
  onPassGranted: (status: AdFreePassStatus) => void;
  userId?: string;
}

export const AdRewardModal: React.FC<AdRewardModalProps> = ({
  onClose,
  onPassGranted,
  userId = 'demo-user-1',
}) => {
  const [step, setStep] = useState<'intro' | 'playing' | 'redeeming' | 'success' | 'error'>('intro');
  const [attemptId, setAttemptId] = useState<string>('');
  const [countdown, setCountdown] = useState<number>(10);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Step 1: Start reward attempt on backend
  const handleStartReward = async () => {
    try {
      const res = await fetch('/api/ads/reward-attempt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, slotKey: 'rewarded_24h_pass' }),
      });
      const data = await res.json();
      if (data.success && data.attemptId) {
        setAttemptId(data.attemptId);
        setStep('playing');
        setCountdown(10);
      } else {
        setErrorMessage('Unable to initialize advertising partner session.');
        setStep('error');
      }
    } catch {
      setErrorMessage('Network error communicating with reward verification server.');
      setStep('error');
    }
  };

  // Step 2: Ad playback countdown
  useEffect(() => {
    if (step !== 'playing') return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleRedeemReward();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [step, attemptId]);

  // Step 3: Redeem verified reward on backend
  const handleRedeemReward = async () => {
    setStep('redeeming');
    try {
      const res = await fetch('/api/ads/redeem-reward', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, attemptId }),
      });
      const data = await res.json();

      if (data.success && data.pass) {
        setStep('success');
        onPassGranted({
          hasActivePass: true,
          remainingSeconds: 86400,
          expiresAt: data.pass.expires_at,
        });
      } else {
        setErrorMessage(data.message || 'Reward validation failed.');
        setStep('error');
      }
    } catch {
      setErrorMessage('Network error validating reward pass.');
      setStep('error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-[#141414] border border-white/15 rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-5 bg-[#1b1b1b] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Movie Mart 24-Hour Ad-Free Pass</h2>
              <p className="text-xs text-gray-400">Stream completely ad-free across all titles</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content by Step */}
        <div className="p-6">
          
          {/* STEP: INTRO */}
          {step === 'intro' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-[#1a1a1a] border border-white/10 space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>How it works:</span>
                </div>
                <ul className="text-xs text-gray-300 space-y-2 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>Watch a single qualifying 10-second sponsored clip from start to finish.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>The verification server issues a cryptographic 24-hour ad-free pass directly to your account.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>All video pre-roll and interruption ads are completely suppressed for the next 24 hours.</span>
                  </li>
                </ul>
              </div>

              <div className="p-3 bg-neutral-900 rounded-xl border border-white/5 text-[11px] text-gray-400 flex items-center gap-2">
                <Info className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <span>Compliant with Google Ad Manager web reward standards. No forced clicks or popup tabs required.</span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-300 hover:text-white hover:bg-white/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStartReward}
                  className="px-5 py-2.5 rounded-xl bg-[#E50914] hover:bg-red-600 text-white font-extrabold text-xs shadow-lg shadow-red-950/60 flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
                >
                  <span>Start Sponsored Clip</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP: PLAYING */}
          {step === 'playing' && (
            <div className="space-y-4">
              <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-white/10">
                <video
                  src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4"
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />

                <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-black/80 border border-white/20 text-xs font-bold text-white flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Reward in {countdown}s</span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                  <div
                    className="h-full bg-amber-400 transition-all duration-1000 ease-linear"
                    style={{ width: `${((10 - countdown) / 10) * 100}%` }}
                  />
                </div>
              </div>

              <p className="text-xs text-gray-400 text-center">
                Please let the clip finish to verify your reward token. Do not close this window.
              </p>
            </div>
          )}

          {/* STEP: REDEEMING */}
          {step === 'redeeming' && (
            <div className="py-12 text-center space-y-3">
              <div className="w-10 h-10 border-3 border-[#E50914] border-t-transparent rounded-full animate-spin mx-auto" />
              <h3 className="text-sm font-bold text-white">Validating Qualified Reward Event...</h3>
              <p className="text-xs text-gray-400">Verifying session token and registering 24-hour pass with database.</p>
            </div>
          )}

          {/* STEP: SUCCESS */}
          {step === 'success' && (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white">24-Hour Pass Unlocked!</h3>
                <p className="text-xs text-gray-300 mt-1 max-w-sm mx-auto">
                  You now have 24 hours of completely ad-free streaming on Movie Mart. All pre-roll placements are suppressed.
                </p>
              </div>

              <div className="p-3 bg-neutral-900 rounded-xl border border-white/10 text-xs text-amber-300 font-mono font-bold">
                Pass Active for: 24h 00m 00s
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-[#E50914] hover:bg-red-600 text-white font-bold text-xs transition-all cursor-pointer"
              >
                Start Watching Ad-Free
              </button>
            </div>
          )}

          {/* STEP: ERROR */}
          {step === 'error' && (
            <div className="py-6 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-white">Reward Not Granted</h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">{errorMessage}</p>

              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={handleStartReward}
                  className="px-4 py-2 rounded-xl bg-[#E50914] hover:bg-red-600 text-white text-xs font-bold cursor-pointer"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
