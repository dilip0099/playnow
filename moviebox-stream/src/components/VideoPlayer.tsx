'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Hls from 'hls.js';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RotateCcw,
  RotateCw,
  Settings,
  ShieldCheck,
  Tv,
  X,
  Check,
  Languages,
} from 'lucide-react';

interface StreamMirror {
  name: string;
  quality: string;
  url: string;
  proxiedUrl: string;
  type: 'hls' | 'mp4';
}

interface VideoPlayerProps {
  streamUrl: string;
  title: string;
  poster?: string;
  mirrors?: StreamMirror[];
  onMirrorSelect?: (mirror: StreamMirror) => void;
}

const formatLanguageLabel = (lang?: string, name?: string, index: number = 0) => {
  const code = (lang || name || '').toLowerCase();
  if (code.includes('hi') || code.includes('hin') || code.includes('hindi')) {
    return 'Hindi (हिन्दी)';
  }
  if (code.includes('en') || code.includes('eng') || code.includes('english')) {
    return 'English (Original)';
  }
  if (code.includes('ta') || code.includes('tam') || code.includes('tamil')) {
    return 'Tamil (தமிழ்)';
  }
  if (code.includes('te') || code.includes('tel') || code.includes('telugu')) {
    return 'Telugu (తెలుగు)';
  }
  if (code.includes('es') || code.includes('spa') || code.includes('spanish')) {
    return 'Spanish (Español)';
  }
  if (code.includes('fr') || code.includes('fre') || code.includes('french')) {
    return 'French (Français)';
  }
  if (name) return name;
  return `Audio Track ${index + 1}`;
};

export default function VideoPlayer({
  streamUrl,
  title,
  poster,
  mirrors = [],
  onMirrorSelect,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Controls Overlay State
  const [showControls, setShowControls] = useState(true);

  // HLS Manifest Stream Options
  const [levels, setLevels] = useState<{ id: number; name: string }[]>([]);
  const [currentLevel, setCurrentLevel] = useState<number>(-1); // -1 = Auto
  const [audioTracks, setAudioTracks] = useState<{ id: number; name: string; lang?: string }[]>([]);
  const [currentAudioTrack, setCurrentAudioTrack] = useState<number>(-1);
  const [subtitleTracks, setSubtitleTracks] = useState<{ id: number; name: string }[]>([]);
  const [currentSubtitleTrack, setCurrentSubtitleTrack] = useState<number>(-1);

  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'quality' | 'audio' | 'server' | 'subtitles'>('quality');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Clear or schedule auto-hide timer
  const scheduleAutoHide = useCallback(() => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (!showSettingsModal) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 2500);
    }
  }, [showSettingsModal]);

  // Handle tap / click on video container
  const handleToggleControls = (e: React.MouseEvent) => {
    if (showSettingsModal) {
      setShowSettingsModal(false);
      return;
    }

    if (showControls) {
      setShowControls(false);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    } else {
      setShowControls(true);
      scheduleAutoHide();
    }
  };

  // Initialize HLS Engine
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !streamUrl) return;

    setIsLoading(true);
    setError(null);
    setAudioTracks([]);

    if (hlsRef.current) {
      hlsRef.current.destroy();
    }

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
        maxBufferLength: 120,
        maxMaxBufferLength: 300,
        maxBufferSize: 60 * 1000 * 1000,
        progressive: true,
        startLevel: -1,
      });

      hlsRef.current = hls;
      hls.loadSource(streamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        setIsLoading(false);
        const availableLevels = data.levels.map((lvl, idx) => ({
          id: idx,
          name: lvl.height ? `${lvl.height}p` : `Bitrate ${Math.round(lvl.bitrate / 1000)}k`,
        }));
        setLevels(availableLevels);

        video
          .play()
          .then(() => {
            setIsPlaying(true);
            setShowControls(false);
          })
          .catch(() => {
            setIsPlaying(false);
            setShowControls(true);
          });
      });

      hls.on(Hls.Events.AUDIO_TRACKS_UPDATED, (event, data) => {
        const aTracks = data.audioTracks.map((t, idx) => ({
          id: idx,
          name: formatLanguageLabel(t.lang, t.name, idx),
          lang: t.lang || '',
        }));
        setAudioTracks(aTracks);
        if (hls.audioTrack !== undefined && hls.audioTrack !== -1) {
          setCurrentAudioTrack(hls.audioTrack);
        }
      });

      hls.on(Hls.Events.AUDIO_TRACK_SWITCHED, (event, data) => {
        setCurrentAudioTrack(data.id);
      });

      hls.on(Hls.Events.SUBTITLE_TRACKS_UPDATED, (event, data) => {
        const sTracks = data.subtitleTracks.map((t, idx) => ({
          id: idx,
          name: t.name || t.lang || `Subtitle ${idx + 1}`,
        }));
        setSubtitleTracks(sTracks);
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          console.error('Fatal HLS Error:', data);
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              hls.destroy();
              setError('Stream load failed. Please select another server below.');
              setIsLoading(false);
              setShowControls(true);
              break;
          }
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
      video.addEventListener('loadedmetadata', () => {
        setIsLoading(false);
        video
          .play()
          .then(() => {
            setIsPlaying(true);
            setShowControls(false);
          })
          .catch(() => {
            setIsPlaying(false);
            setShowControls(true);
          });
      });
    } else {
      setError('HLS playback not supported on this browser.');
      setIsLoading(false);
      setShowControls(true);
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [streamUrl]);

  // Keyboard controls for Desktop
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      const video = videoRef.current;
      if (!video) return;

      switch (e.key.toLowerCase()) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlay();
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'm':
          e.preventDefault();
          toggleMute();
          break;
        case 'arrowright':
          e.preventDefault();
          skipTime(10);
          break;
        case 'arrowleft':
          e.preventDefault();
          skipTime(-10);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const togglePlay = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().then(() => {
        scheduleAutoHide();
      }).catch((err) => {
        console.error('Play failed:', err);
      });
    } else {
      video.pause();
      setShowControls(true);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    }
  };

  const skipTime = (seconds: number, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    const video = videoRef.current;
    if (!video) return;

    const current = video.currentTime || 0;
    const dur = video.duration;
    let target = current + seconds;

    if (target < 0) target = 0;
    if (dur && !isNaN(dur) && isFinite(dur) && dur > 0 && target > dur) {
      target = dur;
    }

    video.currentTime = target;
    setCurrentTime(target);
    setShowControls(true);
    scheduleAutoHide();
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      scheduleAutoHide();
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (videoRef.current) {
      videoRef.current.volume = newVol;
      setIsMuted(newVol === 0);
    }
    scheduleAutoHide();
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
    scheduleAutoHide();
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => console.error(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch((err) => console.error(err));
      setIsFullscreen(false);
    }
    scheduleAutoHide();
  };

  const changeQuality = (levelId: number) => {
    if (hlsRef.current) {
      hlsRef.current.currentLevel = levelId;
      setCurrentLevel(levelId);
      setShowSettingsModal(false);
      scheduleAutoHide();
    }
  };

  const changeAudioTrack = (trackId: number) => {
    if (hlsRef.current) {
      hlsRef.current.audioTrack = trackId;
      setCurrentAudioTrack(trackId);
      setShowSettingsModal(false);
      scheduleAutoHide();
    }
  };

  const changeSubtitleTrack = (trackId: number) => {
    if (hlsRef.current) {
      hlsRef.current.subtitleTrack = trackId;
      setCurrentSubtitleTrack(trackId);
      setShowSettingsModal(false);
      scheduleAutoHide();
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="w-full flex flex-col items-center select-none">
      {/* PLAYER CONTAINER */}
      <div
        ref={containerRef}
        onClick={handleToggleControls}
        className="relative w-full aspect-video bg-black rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border border-neutral-800/80 group"
      >
        {/* Loading State Spinner */}
        {isLoading && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/85 backdrop-blur-sm">
            <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-2.5"></div>
            <p className="text-xs font-semibold text-neutral-300">Loading Clean HLS Stream...</p>
          </div>
        )}

        {/* Error Alert Overlay */}
        {error && (
          <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/90 p-6 text-center">
            <p className="text-red-400 font-semibold text-xs sm:text-sm mb-3">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl flex items-center space-x-2 shadow-lg"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reload Player</span>
            </button>
          </div>
        )}

        {/* NATIVE HTML VIDEO ELEMENT */}
        <video
          ref={videoRef}
          className="w-full h-full object-contain cursor-pointer"
          onTimeUpdate={handleTimeUpdate}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => {
            setIsPlaying(false);
            setShowControls(true);
          }}
          poster={poster}
          playsInline
        >
          <track kind="captions" src="https://cdn.jsdelivr.net/gh/brian-the-dev/subtitles@main/en.vtt" srcLang="hi" label="Hindi" default />
        </video>

        {/* CONTROLS OVERLAY */}
        <div
          className={`absolute inset-0 z-20 bg-gradient-to-t from-black/90 via-transparent to-black/70 flex flex-col justify-between p-3 sm:p-5 transition-opacity duration-300 ${showControls ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
        >
          {/* TOP BAR */}
          <div className="flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1.5 bg-emerald-950/80 backdrop-blur-md border border-emerald-500/30 text-emerald-400 text-[10px] sm:text-xs px-2.5 py-1 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-bold uppercase tracking-wider">Ad-Free HLS</span>
              </div>
              <h3 className="text-white font-bold text-xs sm:text-sm drop-shadow-md truncate max-w-[160px] sm:max-w-xs">
                {title}
              </h3>
            </div>

            {mirrors.length > 0 && (
              <div className="hidden sm:flex items-center space-x-1 text-neutral-300 text-xs font-medium">
                <Tv className="w-3.5 h-3.5 text-red-500" />
                <span>{mirrors.length} Servers</span>
              </div>
            )}
          </div>

          {/* CENTER QUICK ACTION TOUCH BUTTONS */}
          <div
            className="flex items-center justify-center space-x-8 sm:space-x-12"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Rewind -10s */}
            <button
              type="button"
              onClick={(e) => skipTime(-10, e)}
              className="p-2.5 sm:p-3.5 bg-black/70 hover:bg-black/90 text-white rounded-full backdrop-blur-md border border-white/10 active:scale-90 transition cursor-pointer"
              aria-label="Rewind 10 seconds"
            >
              <div className="flex flex-col items-center pointer-events-none">
                <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="text-[9px] font-extrabold mt-0.5">-10s</span>
              </div>
            </button>

            {/* Play / Pause Toggle */}
            <button
              type="button"
              onClick={(e) => togglePlay(e)}
              className="p-4 sm:p-5 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-xl shadow-red-950/80 active:scale-90 transition cursor-pointer"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-7 h-7 sm:w-8 sm:h-8 fill-current pointer-events-none" />
              ) : (
                <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current translate-x-0.5 pointer-events-none" />
              )}
            </button>

            {/* Forward +10s */}
            <button
              type="button"
              onClick={(e) => skipTime(10, e)}
              className="p-2.5 sm:p-3.5 bg-black/70 hover:bg-black/90 text-white rounded-full backdrop-blur-md border border-white/10 active:scale-90 transition cursor-pointer"
              aria-label="Forward 10 seconds"
            >
              <div className="flex flex-col items-center pointer-events-none">
                <RotateCw className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="text-[9px] font-extrabold mt-0.5">+10s</span>
              </div>
            </button>
          </div>

          {/* BOTTOM CONTROLS & SEEK BAR */}
          <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
            {/* Seek Slider Bar */}
            <div className="flex items-center space-x-2">
              <span className="text-[11px] text-neutral-300 font-mono w-10 text-right">
                {formatTime(currentTime)}
              </span>

              <div className="relative flex-1 py-1">
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1.5 sm:h-2 bg-neutral-700/80 accent-red-600 rounded-lg cursor-pointer touch-pan-x"
                />
              </div>

              <span className="text-[11px] text-neutral-400 font-mono w-10">
                {formatTime(duration)}
              </span>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={(e) => togglePlay(e)}
                  className="text-white hover:text-red-500 active:scale-90 transition p-1"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
                </button>

                <div className="flex items-center space-x-1.5">
                  <button onClick={toggleMute} className="text-neutral-300 hover:text-white transition p-1">
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-4 h-4 text-red-500" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="hidden sm:block w-16 h-1 bg-neutral-700 accent-red-600 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {/* Settings Gear Button */}
                <button
                  type="button"
                  onClick={() => setShowSettingsModal(!showSettingsModal)}
                  className="px-2.5 py-1 bg-neutral-900/90 border border-neutral-700/80 rounded-lg text-[10px] sm:text-xs font-semibold text-neutral-200 flex items-center space-x-1 hover:border-red-500 transition"
                >
                  <Settings className="w-3.5 h-3.5 text-red-500" />
                  <span>{currentLevel === -1 ? 'Auto Quality' : levels[currentLevel]?.name}</span>
                </button>

                {/* Fullscreen Button */}
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className="text-neutral-300 hover:text-white transition p-1 active:scale-90"
                >
                  {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SETTINGS MODAL DIALOG */}
        {showSettingsModal && (
          <div
            className="absolute inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-3"
            onClick={(e) => {
              e.stopPropagation();
              setShowSettingsModal(false);
            }}
          >
            <div
              className="w-full sm:max-w-xs bg-neutral-900 border border-neutral-800 rounded-2xl p-4 space-y-3 animate-fade-in shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Stream Settings</span>
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="p-1 text-neutral-400 hover:text-white transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* TABS HEADER */}
              <div className="grid grid-cols-4 gap-1 bg-neutral-950 p-1 rounded-xl">
                <button
                  onClick={() => setActiveTab('quality')}
                  className={`py-1 text-[10px] font-bold rounded-lg transition ${activeTab === 'quality' ? 'bg-red-600 text-white' : 'text-neutral-400'
                    }`}
                >
                  Quality
                </button>
                <button
                  onClick={() => setActiveTab('audio')}
                  className={`py-1 text-[10px] font-bold rounded-lg transition ${activeTab === 'audio' ? 'bg-red-600 text-white' : 'text-neutral-400'
                    }`}
                >
                  Audio
                </button>
                <button
                  onClick={() => setActiveTab('server')}
                  className={`py-1 text-[10px] font-bold rounded-lg transition ${activeTab === 'server' ? 'bg-red-600 text-white' : 'text-neutral-400'
                    }`}
                >
                  Server
                </button>
                <button
                  onClick={() => setActiveTab('subtitles')}
                  className={`py-1 text-[10px] font-bold rounded-lg transition ${activeTab === 'subtitles' ? 'bg-red-600 text-white' : 'text-neutral-400'
                    }`}
                >
                  Subtitles
                </button>
              </div>

              {/* Quality Tab */}
              {activeTab === 'quality' && (
                <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                  <button
                    onClick={() => changeQuality(-1)}
                    className={`w-full text-left px-3 py-1.5 text-xs rounded-xl flex items-center justify-between ${currentLevel === -1
                        ? 'bg-red-950/60 text-red-400 font-bold border border-red-800/50'
                        : 'text-neutral-300 hover:bg-neutral-800'
                      }`}
                  >
                    <span>Auto (Adaptive HD)</span>
                    {currentLevel === -1 && <Check className="w-3.5 h-3.5 text-red-500" />}
                  </button>
                  {levels.map((lvl) => (
                    <button
                      key={lvl.id}
                      onClick={() => changeQuality(lvl.id)}
                      className={`w-full text-left px-3 py-1.5 text-xs rounded-xl flex items-center justify-between ${currentLevel === lvl.id
                          ? 'bg-red-950/60 text-red-400 font-bold border border-red-800/50'
                          : 'text-neutral-300 hover:bg-neutral-800'
                        }`}
                    >
                      <span>{lvl.name}</span>
                      {currentLevel === lvl.id && <Check className="w-3.5 h-3.5 text-red-500" />}
                    </button>
                  ))}
                </div>
              )}

              {/* Audio Tab - ONLY Language Names */}
              {activeTab === 'audio' && (
                <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                  {audioTracks.length > 0 ? (
                    audioTracks.map((tr) => (
                      <button
                        key={tr.id}
                        type="button"
                        onClick={() => changeAudioTrack(tr.id)}
                        className={`w-full text-left px-3 py-2 text-xs rounded-xl flex items-center justify-between transition ${currentAudioTrack === tr.id
                            ? 'bg-red-950/60 text-red-400 font-bold border border-red-800/50'
                            : 'text-neutral-300 hover:bg-neutral-800'
                          }`}
                      >
                        <div className="flex items-center space-x-2">
                          <Languages className="w-3.5 h-3.5 text-red-500" />
                          <span>{tr.name}</span>
                        </div>
                        {currentAudioTrack === tr.id && <Check className="w-3.5 h-3.5 text-red-500" />}
                      </button>
                    ))
                  ) : (
                    <div className="space-y-1">
                      <button
                        type="button"
                        className="w-full text-left px-3 py-2 text-xs rounded-xl flex items-center justify-between bg-red-950/60 text-red-400 font-bold border border-red-800/50"
                      >
                        <div className="flex items-center space-x-2">
                          <Languages className="w-3.5 h-3.5 text-red-500" />
                          <span>Default Audio (Original)</span>
                        </div>
                        <Check className="w-3.5 h-3.5 text-red-500" />
                      </button>
                      <p className="text-[10px] text-neutral-400 px-2 pt-1 leading-relaxed">
                        Is stream file mein 1 default audio stream hai. HLS multi-audio manifests hone par alternate languages (Hindi, English, etc.) yahan list honge.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Server Tab - ONLY Stream Servers */}
              {activeTab === 'server' && (
                <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                  {mirrors.length > 0 ? (
                    mirrors.map((mirror, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          if (onMirrorSelect) onMirrorSelect(mirror);
                          setShowSettingsModal(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs rounded-xl flex items-center justify-between border transition ${streamUrl === mirror.proxiedUrl
                            ? 'bg-red-950/70 border-red-700 text-red-400 font-bold'
                            : 'bg-neutral-800/80 border-neutral-700 text-neutral-300 hover:bg-neutral-700'
                          }`}
                      >
                        <div className="flex items-center space-x-2">
                          <Tv className="w-3.5 h-3.5 text-red-500" />
                          <span>{mirror.name}</span>
                        </div>
                        {streamUrl === mirror.proxiedUrl && <Check className="w-3.5 h-3.5 text-red-500" />}
                      </button>
                    ))
                  ) : (
                    <p className="text-xs text-neutral-400 p-2">Server 1 (Primary)</p>
                  )}
                </div>
              )}

              {/* Subtitles Tab */}
              {activeTab === 'subtitles' && (
                <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                  <button
                    onClick={() => changeSubtitleTrack(-1)}
                    className={`w-full text-left px-3 py-1.5 text-xs rounded-xl flex items-center justify-between ${currentSubtitleTrack === -1
                        ? 'bg-red-950/60 text-red-400 font-bold border border-red-800/50'
                        : 'text-neutral-300 hover:bg-neutral-800'
                      }`}
                  >
                    <span>Off</span>
                    {currentSubtitleTrack === -1 && <Check className="w-3.5 h-3.5 text-red-500" />}
                  </button>
                  {subtitleTracks.length === 0 ? (
                    <button
                      onClick={() => changeSubtitleTrack(0)}
                      className="w-full text-left px-3 py-1.5 text-xs text-neutral-300 hover:bg-neutral-800 rounded-xl"
                    >
                      Hindi / English Subtitles
                    </button>
                  ) : (
                    subtitleTracks.map((st) => (
                      <button
                        key={st.id}
                        onClick={() => changeSubtitleTrack(st.id)}
                        className={`w-full text-left px-3 py-1.5 text-xs rounded-xl flex items-center justify-between ${currentSubtitleTrack === st.id
                            ? 'bg-red-950/60 text-red-400 font-bold border border-red-800/50'
                            : 'text-neutral-300 hover:bg-neutral-800'
                          }`}
                      >
                        <span>{st.name}</span>
                        {currentSubtitleTrack === st.id && <Check className="w-3.5 h-3.5 text-red-500" />}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* STREAM MIRROR SWITCHER BAR */}
      {mirrors.length > 1 && (
        <div className="w-full mt-3 bg-neutral-900/80 border border-neutral-800/80 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <Tv className="w-4 h-4 text-red-500" />
            <span className="text-xs font-semibold text-neutral-200">
              Stream Servers:
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
            {mirrors.map((mirror, idx) => (
              <button
                key={idx}
                onClick={() => onMirrorSelect && onMirrorSelect(mirror)}
                className={`flex-1 sm:flex-none px-3 py-1.5 text-[11px] font-bold rounded-lg border transition ${streamUrl === mirror.proxiedUrl
                    ? 'bg-red-600 border-red-500 text-white shadow-md'
                    : 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-700'
                  }`}
              >
                {mirror.name} ({mirror.quality})
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
