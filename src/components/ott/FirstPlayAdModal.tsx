import React, { useState, useEffect } from 'react';
import { X, Sparkles, ShieldCheck, ArrowRight, Play, Volume2, Info } from 'lucide-react';
import { Title } from '../../types/ott';

interface FirstPlayAdModalProps {
  title: Title;
  onAdCompleted: () => void;
  onOpenRewardPass: () => void;
  onCancel: () => void;
}

export const FirstPlayAdModal: React.FC<FirstPlayAdModalProps> = ({
  title,
  onAdCompleted,
  onOpenRewardPass,
  onCancel,
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState(5);
  const [canSkip, setCanSkip] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanSkip(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-[#141414] border border-white/15 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Top Header */}
        <div className="p-4 bg-[#1c1c1c] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-black uppercase tracking-wider">
              Sponsored Advertisement
            </span>
            <span className="text-xs text-gray-400">
              Playing before <span className="text-white font-bold">{title.title}</span>
            </span>
          </div>
          <button
            onClick={onCancel}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video / Creative Showcase */}
        <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
          {/* High-quality licensed promotional clip */}
          <video
            src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

          {/* Ad Disclosure Badge */}
          <div className="absolute bottom-3 left-3 flex items-center gap-2 text-[11px] text-gray-300 bg-black/70 px-2.5 py-1 rounded backdrop-blur-sm border border-white/10">
            <Info className="w-3.5 h-3.5 text-amber-400" />
            <span>MovieMart Verified Sponsor Placement</span>
          </div>

          {/* Countdown & Skip button */}
          <div className="absolute bottom-3 right-3">
            {canSkip ? (
              <button
                onClick={onAdCompleted}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#E50914] hover:bg-red-600 text-white font-bold text-xs shadow-lg transition-all cursor-pointer"
              >
                <span>Skip to Movie</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="px-3 py-1.5 rounded-lg bg-black/80 text-white font-mono text-xs border border-white/20">
                Skip in {secondsRemaining}s
              </div>
            )}
          </div>
        </div>

        {/* Bottom 24-Hour Pass Banner */}
        <div className="p-4 bg-[#181818] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-xs text-gray-300">
            <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>Tired of pre-roll ads? Unlock 24 hours of completely ad-free viewing!</span>
          </div>

          <button
            onClick={() => {
              onCancel();
              onOpenRewardPass();
            }}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold whitespace-nowrap transition-colors cursor-pointer border border-white/10"
          >
            Unlock 24h Pass
          </button>
        </div>

      </div>
    </div>
  );
};
