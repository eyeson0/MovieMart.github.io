import React, { useState, useRef, useEffect } from 'react';
import { X, Play, Pause, Volume2, VolumeX, Maximize, Minimize, Lamp, Sparkles } from 'lucide-react';
import { Movie } from '../types/movie';

interface VideoPlayerModalProps {
  movie: Movie;
  titleOverride?: string;
  videoUrlOverride?: string;
  onClose: () => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  movie,
  titleOverride,
  videoUrlOverride,
  onClose,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [ambientGlow, setAmbientGlow] = useState(true);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100);
        setCurrentTime(formatTime(video.currentTime));
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(formatTime(video.duration));
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const seekPercentage = Number(e.target.value);
    const seekTime = (seekPercentage / 100) * videoRef.current.duration;
    videoRef.current.currentTime = seekTime;
    setProgress(seekPercentage);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const videoSource = videoUrlOverride || movie.trailerUrl;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/95 backdrop-blur-xl">
      <div
        ref={containerRef}
        className={`relative w-full max-w-5xl rounded-3xl overflow-hidden bg-black border border-white/10 shadow-2xl transition-all ${
          ambientGlow ? 'shadow-[0_0_80px_rgba(225,29,72,0.25)]' : ''
        }`}
      >
        {/* Top Floating Bar */}
        <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-b from-black/80 via-black/40 to-transparent z-20 flex items-center justify-between pointer-events-auto">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-rose-600 text-[10px] font-black uppercase text-white tracking-wider">
                {titleOverride ? 'Full Feature' : 'Official Trailer'}
              </span>
              <span className="text-xs text-sky-400 font-semibold">
                {movie.specs.resolution} • {movie.specs.audio}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white mt-0.5">
              {titleOverride || movie.title}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setAmbientGlow(!ambientGlow)}
              className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                ambientGlow
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-black/60 text-slate-400 border border-white/10'
              }`}
              title="Toggle Cinema Ambient Glow"
            >
              <Lamp className="w-4 h-4" />
              <span className="hidden sm:inline">Cinema Ambiance</span>
            </button>

            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-black/60 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Player */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center">
          <video
            ref={videoRef}
            src={videoSource}
            autoPlay
            playsInline
            onClick={togglePlay}
            className="w-full h-full object-contain cursor-pointer"
          />

          {/* Ambient colored side-glow reflections */}
          {ambientGlow && (
            <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-screen bg-gradient-to-r from-rose-600 via-transparent to-amber-500 animate-pulse" />
          )}
        </div>

        {/* Bottom Playback Controls */}
        <div className="p-4 sm:p-5 bg-[#0e111a] border-t border-white/10 space-y-3 z-20 relative">
          
          {/* Progress bar */}
          <div className="relative flex items-center">
            <input
              type="range"
              min="0"
              max="100"
              step="0.1"
              value={progress}
              onChange={handleSeek}
              className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-rose-600 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-4">
              <button
                onClick={togglePlay}
                className="w-9 h-9 rounded-full bg-white text-slate-950 flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 fill-slate-950" />
                ) : (
                  <Play className="w-4 h-4 fill-slate-950 ml-0.5" />
                )}
              </button>

              <button
                onClick={toggleMute}
                className="p-2 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                {isMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5" />}
              </button>

              <span className="font-mono text-xs text-slate-400">
                {currentTime} / {duration}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden sm:inline px-2 py-1 rounded bg-white/5 border border-white/10 text-[11px] font-semibold text-slate-300">
                Dolby Vision HDR
              </span>

              <button
                onClick={toggleFullscreen}
                className="p-2 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
