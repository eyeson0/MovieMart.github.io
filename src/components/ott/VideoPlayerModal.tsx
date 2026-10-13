import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  RotateCcw, 
  RotateCw, 
  Server, 
  Languages, 
  Subtitles, 
  AlertCircle, 
  RefreshCw, 
  ArrowLeft,
  Sliders,
  Check
} from 'lucide-react';
import { Title, StreamingSource } from '../../types/ott';

interface VideoPlayerModalProps {
  title: Title;
  initialSources: StreamingSource[];
  initialProgressSeconds?: number;
  onClose: () => void;
  onSaveProgress: (titleId: string, progressSeconds: number, durationSeconds: number) => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  title,
  initialSources,
  initialProgressSeconds = 0,
  onClose,
  onSaveProgress,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Active server source
  const [sources, setSources] = useState<StreamingSource[]>(initialSources);
  const [activeSourceIndex, setActiveSourceIndex] = useState<number>(0);
  
  // Audio & Subtitle track
  const [selectedAudio, setSelectedAudio] = useState<string>(
    title.languages.find((l) => l.isOriginal)?.name || title.languages[0]?.name || 'English'
  );
  const [selectedSubtitle, setSelectedSubtitle] = useState<string>('Off');

  // Playback state
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [currentTimeSec, setCurrentTimeSec] = useState<number>(initialProgressSeconds);
  const [durationSec, setDurationSec] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);
  
  // Truthful Error states
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Active source object
  const currentSource = sources[activeSourceIndex];

  // Check initial availability
  useEffect(() => {
    if (!currentSource || !currentSource.is_active) {
      if (sources.length === 0) {
        setIsError(true);
        setErrorMessage('Streaming is not available for this title yet.');
      } else {
        setIsError(true);
        setErrorMessage('This server is currently unavailable. Try again later or choose another available source.');
      }
      setIsLoading(false);
    } else if (currentSource.health_status === 'offline') {
      setIsError(true);
      setErrorMessage('This server is currently unavailable. Try again later or choose another available source.');
      setIsLoading(false);
    } else {
      setIsError(false);
      setErrorMessage('');
      setIsLoading(true);
    }
  }, [currentSource, sources]);

  // Video event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Apply resume position once loaded
    const handleLoadedMetadata = () => {
      setDurationSec(video.duration);
      if (initialProgressSeconds > 0 && initialProgressSeconds < video.duration) {
        video.currentTime = initialProgressSeconds;
      }
      setIsLoading(false);
      setIsError(false);
      video.play().catch(() => setIsPlaying(false));
    };

    const handleTimeUpdate = () => {
      if (video.duration) {
        setCurrentTimeSec(video.currentTime);
        setProgress((video.currentTime / video.duration) * 100);
      }
    };

    const handleError = () => {
      setIsLoading(false);
      setIsError(true);
      if (currentSource?.health_status === 'offline') {
        setErrorMessage('This server is currently unavailable. Try again later or choose another available source.');
      } else {
        setErrorMessage('Unable to load the video. Check your connection and try again.');
      }
    };

    const handleWaiting = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('error', handleError);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('canplay', handleCanPlay);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('error', handleError);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, [currentSource, initialProgressSeconds]);

  // Auto-save watch progress every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentTimeSec > 5 && durationSec > 0) {
        onSaveProgress(title.id, currentTimeSec, durationSec);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [currentTimeSec, durationSec, title.id, onSaveProgress]);

  // Handle server switch
  const handleSwitchServer = (idx: number) => {
    const selected = sources[idx];
    setActiveSourceIndex(idx);
    setIsLoading(true);

    if (!selected.is_active || selected.health_status === 'offline') {
      setIsError(true);
      setErrorMessage('This server is currently unavailable. Try again later or choose another available source.');
      setIsLoading(false);
    } else {
      setIsError(false);
      setErrorMessage('');
    }
  };

  const togglePlay = () => {
    if (!videoRef.current || isError) return;
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
    if (!videoRef.current || !videoRef.current.duration) return;
    const seekPercentage = Number(e.target.value);
    const seekTime = (seekPercentage / 100) * videoRef.current.duration;
    videoRef.current.currentTime = seekTime;
    setProgress(seekPercentage);
  };

  const skipSeconds = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(0, Math.min(videoRef.current.duration, videoRef.current.currentTime + seconds));
  };

  const handleSpeedChange = (speed: number) => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = speed;
    setPlaybackSpeed(speed);
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

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center select-none"
      onMouseMove={() => setShowControls(true)}
    >
      {/* Top Bar with Title, Server Selector & Close */}
      <div
        className={`absolute top-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-b from-black/90 via-black/40 to-transparent z-30 flex items-center justify-between transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (currentTimeSec > 0 && durationSec > 0) {
                onSaveProgress(title.id, currentTimeSec, durationSec);
              }
              onClose();
            }}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Back to Catalog"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-base sm:text-xl font-black text-white">{title.title}</h2>
            <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
              <span>{title.release_year}</span>
              <span>•</span>
              <span className="text-[#E50914] font-bold">{currentSource?.quality_label || '1080p'}</span>
              <span>•</span>
              <span>Audio: {selectedAudio}</span>
            </div>
          </div>
        </div>

        {/* Server & Audio Switchers */}
        <div className="flex items-center gap-2">
          {/* Server Switcher Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 border border-white/20 text-xs font-bold text-gray-200 hover:text-white cursor-pointer">
              <Server className="w-3.5 h-3.5 text-amber-400" />
              <span>{currentSource ? currentSource.server_name.split(' ')[0] : 'No Server'}</span>
            </button>

            {/* Dropdown menu */}
            <div className="absolute right-0 mt-1 w-64 bg-[#181818] border border-white/15 rounded-xl shadow-2xl overflow-hidden hidden group-hover:block z-40 p-1.5 space-y-1">
              <div className="px-2.5 py-1 text-[10px] font-bold text-gray-400 uppercase">
                Available Servers
              </div>
              {sources.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => handleSwitchServer(idx)}
                  className={`w-full px-2.5 py-2 rounded-lg text-left text-xs flex items-center justify-between cursor-pointer transition-colors ${
                    activeSourceIndex === idx
                      ? 'bg-[#E50914] text-white font-bold'
                      : 'text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <div className="truncate">
                    <div>{s.server_name}</div>
                    <div className="text-[10px] opacity-75">{s.provider_name}</div>
                  </div>
                  {s.health_status === 'offline' ? (
                    <span className="px-1.5 py-0.5 rounded bg-red-950 text-red-400 text-[9px] font-bold">
                      Offline
                    </span>
                  ) : (
                    <span className="text-[10px] opacity-80">{s.latency_ms}ms</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={() => {
              if (currentTimeSec > 0 && durationSec > 0) {
                onSaveProgress(title.id, currentTimeSec, durationSec);
              }
              onClose();
            }}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Video Element / Truthful Error Screen */}
      <div className="relative w-full h-full flex items-center justify-center bg-black">
        {isError ? (
          /* Truthful Error Screen */
          <div className="max-w-md p-6 bg-[#181818] rounded-2xl border border-white/15 text-center space-y-4 shadow-2xl mx-4">
            <div className="w-14 h-14 rounded-full bg-red-500/20 text-red-500 border border-red-500/30 flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">Playback Unavailable</h3>
            <p className="text-sm text-gray-300 leading-relaxed">{errorMessage}</p>

            <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
              {sources.length > 1 && (
                <button
                  onClick={() => {
                    const nextIdx = (activeSourceIndex + 1) % sources.length;
                    handleSwitchServer(nextIdx);
                  }}
                  className="px-4 py-2 rounded-lg bg-[#E50914] hover:bg-red-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Switch Server ({sources[(activeSourceIndex + 1) % sources.length]?.server_name.split(' ')[0]})</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-gray-200 text-xs font-bold cursor-pointer"
              >
                Return to Catalog
              </button>
            </div>
          </div>
        ) : (
          /* Active Video Player */
          <video
            ref={videoRef}
            src={currentSource?.stream_url}
            autoPlay
            playsInline
            onClick={togglePlay}
            className="w-full h-full object-contain cursor-pointer"
          />
        )}

        {/* Loading Spinner */}
        {isLoading && !isError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none">
            <div className="w-12 h-12 border-4 border-[#E50914] border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Bottom Controls Bar */}
      {!isError && (
        <div
          className={`absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black/95 via-black/60 to-transparent z-30 space-y-3 transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Progress Seekbar */}
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="0"
              max="100"
              step="0.1"
              value={progress}
              onChange={handleSeek}
              className="w-full h-1.5 bg-white/30 rounded-lg appearance-none cursor-pointer accent-[#E50914] focus:outline-none"
            />
          </div>

          {/* Controls Buttons */}
          <div className="flex items-center justify-between text-white text-xs">
            <div className="flex items-center gap-4">
              <button
                onClick={togglePlay}
                className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-black" /> : <Play className="w-4 h-4 fill-black ml-0.5" />}
              </button>

              <button
                onClick={() => skipSeconds(-10)}
                className="p-1.5 text-gray-300 hover:text-white cursor-pointer"
                title="Rewind 10s"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => skipSeconds(10)}
                className="p-1.5 text-gray-300 hover:text-white cursor-pointer"
                title="Forward 10s"
              >
                <RotateCw className="w-4 h-4" />
              </button>

              <button
                onClick={toggleMute}
                className="p-1.5 text-gray-300 hover:text-white cursor-pointer"
              >
                {isMuted ? <VolumeX className="w-5 h-5 text-red-500" /> : <Volume2 className="w-5 h-5" />}
              </button>

              <span className="font-mono text-xs text-gray-300">
                {formatTime(currentTimeSec)} / {formatTime(durationSec)}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Playback speed selector */}
              <div className="relative group">
                <button className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-xs font-bold text-gray-200 cursor-pointer">
                  {playbackSpeed}x
                </button>
                <div className="absolute bottom-full mb-1 right-0 bg-[#181818] border border-white/15 rounded-lg p-1 hidden group-hover:flex flex-col gap-1 z-40">
                  {[0.5, 0.75, 1, 1.25, 1.5, 2].map((spd) => (
                    <button
                      key={spd}
                      onClick={() => handleSpeedChange(spd)}
                      className={`px-3 py-1 rounded text-xs text-left cursor-pointer ${
                        playbackSpeed === spd ? 'bg-[#E50914] text-white font-bold' : 'text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Audio Track Selector */}
              <div className="relative group">
                <button className="flex items-center gap-1 p-2 rounded hover:bg-white/10 text-gray-300 hover:text-white cursor-pointer" title="Audio Language">
                  <Languages className="w-4 h-4" />
                </button>
                <div className="absolute bottom-full mb-1 right-0 w-44 bg-[#181818] border border-white/15 rounded-lg p-1.5 hidden group-hover:block z-40 space-y-1">
                  <div className="text-[10px] font-bold text-gray-400 uppercase px-2 py-0.5">
                    Audio Language
                  </div>
                  {title.languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => setSelectedAudio(l.name)}
                      className={`w-full px-2 py-1 rounded text-left text-xs flex items-center justify-between cursor-pointer ${
                        selectedAudio === l.name ? 'bg-[#E50914] text-white font-bold' : 'text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      <span>{l.name}</span>
                      {selectedAudio === l.name && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subtitle Selector */}
              <div className="relative group">
                <button className="flex items-center gap-1 p-2 rounded hover:bg-white/10 text-gray-300 hover:text-white cursor-pointer" title="Subtitles">
                  <Subtitles className="w-4 h-4" />
                </button>
                <div className="absolute bottom-full mb-1 right-0 w-40 bg-[#181818] border border-white/15 rounded-lg p-1.5 hidden group-hover:block z-40 space-y-1">
                  <div className="text-[10px] font-bold text-gray-400 uppercase px-2 py-0.5">
                    Subtitles
                  </div>
                  <button
                    onClick={() => setSelectedSubtitle('Off')}
                    className={`w-full px-2 py-1 rounded text-left text-xs flex items-center justify-between cursor-pointer ${
                      selectedSubtitle === 'Off' ? 'bg-[#E50914] text-white font-bold' : 'text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    <span>Off</span>
                    {selectedSubtitle === 'Off' && <Check className="w-3.5 h-3.5" />}
                  </button>
                  {title.subtitles.map((sub) => (
                    <button
                      key={sub.code}
                      onClick={() => setSelectedSubtitle(sub.label)}
                      className={`w-full px-2 py-1 rounded text-left text-xs flex items-center justify-between cursor-pointer ${
                        selectedSubtitle === sub.label ? 'bg-[#E50914] text-white font-bold' : 'text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      <span>{sub.label}</span>
                      {selectedSubtitle === sub.label && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fullscreen Button */}
              <button
                onClick={toggleFullscreen}
                className="p-1.5 rounded hover:bg-white/10 text-gray-300 hover:text-white cursor-pointer"
              >
                {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
