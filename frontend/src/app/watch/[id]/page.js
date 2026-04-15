"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./page.module.css";

const API = process.env.NEXT_PUBLIC_API_URL;

/* ── Helpers ─────────────────────────────────────────────────────── */
function fmtTime(s) {
  if (!isFinite(s)) return "0:00";
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = Math.floor(s % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  return `${m}:${String(sec).padStart(2, "0")}`;
}

/* ── Icons ───────────────────────────────────────────────────────── */
const IconPlay = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);
const IconPause = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" />
  </svg>
);
const IconFullscreen = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
  </svg>
);
const IconVolume = ({ muted }) => muted
  ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
    </svg>
  );
const IconBack = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);

/* ── Page ────────────────────────────────────────────────────────── */
export default function WatchPage() {
  const { id } = useParams();
  const router = useRouter();

  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const hideTimer = useRef(null);

  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [fileName, setFileName] = useState("Loading...");

  const streamURL = `${API}/api/drive/stream/${id}`;

  // Fetch file name from the /api/drive/files list
  useEffect(() => {
    fetch(`${API}/api/drive/files`, { credentials: "include" })
      .then((r) => r.json())
      .then((files) => {
        const f = files.find((f) => f.id === id);
        if (f) setFileName(f.name.replace(/\.(mkv|mp4)$/i, ""));
      })
      .catch(() => {});
  }, [id]);

  // Hide controls after 3s of inactivity
  const resetHideTimer = useCallback(() => {
    setControlsVisible(true);
    clearTimeout(hideTimer.current);
    if (playing) {
      hideTimer.current = setTimeout(() => setControlsVisible(false), 3000);
    }
  }, [playing]);

  useEffect(() => {
    resetHideTimer();
    return () => clearTimeout(hideTimer.current);
  }, [playing, resetHideTimer]);

  /* Video events */
  const onTimeUpdate = () => setCurrentTime(videoRef.current?.currentTime ?? 0);
  const onLoadedMetadata = () => setDuration(videoRef.current?.duration ?? 0);
  const onPlay = () => setPlaying(true);
  const onPause = () => { setPlaying(false); setControlsVisible(true); };

  /* Controls */
  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    v.paused ? v.play() : v.pause();
  };

  const seek = (e) => {
    const v = videoRef.current;
    if (!v || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    v.currentTime = ((e.clientX - rect.left) / rect.width) * duration;
  };

  const changeVolume = (e) => {
    const v = videoRef.current;
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (v) { v.volume = val; v.muted = val === 0; }
    setMuted(val === 0);
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={styles.root}>
      {/* Back bar */}
      <div className={styles.topBar}>
        <button className={styles.backBtn} onClick={() => router.push("/library")}>
          <IconBack />
          <span>Library</span>
        </button>
        <span className={styles.topTitle}>{fileName}</span>
      </div>

      {/* Player */}
      <div
        ref={containerRef}
        className={`${styles.playerWrap} ${!controlsVisible ? styles.hideCursor : ""}`}
        onMouseMove={resetHideTimer}
        onMouseLeave={() => playing && setControlsVisible(false)}
        onClick={togglePlay}
      >
        <video
          ref={videoRef}
          src={streamURL}
          className={styles.video}
          onTimeUpdate={onTimeUpdate}
          onLoadedMetadata={onLoadedMetadata}
          onPlay={onPlay}
          onPause={onPause}
          crossOrigin="use-credentials"
        />

        {/* Big play/pause centred overlay */}
        <div className={`${styles.bigPlayOverlay} ${playing ? styles.hidden : ""}`}>
          <div className={styles.bigPlayBtn}>
            <IconPlay />
          </div>
        </div>

        {/* Controls overlay */}
        <div
          className={`${styles.controls} ${controlsVisible ? styles.controlsVisible : ""}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Gradient fade */}
          <div className={styles.controlsGrad} />

          <div className={styles.controlsInner}>
            {/* Seek bar */}
            <div className={styles.seekBar} onClick={seek}>
              <div className={styles.seekTrack}>
                <div className={styles.seekFill} style={{ width: `${progress}%` }} />
                <div className={styles.seekThumb} style={{ left: `${progress}%` }} />
              </div>
            </div>

            {/* Bottom row */}
            <div className={styles.controlsRow}>
              <div className={styles.leftControls}>
                <button className={styles.controlBtn} onClick={togglePlay} aria-label={playing ? "Pause" : "Play"}>
                  {playing ? <IconPause /> : <IconPlay />}
                </button>

                <button className={styles.controlBtn} onClick={toggleMute} aria-label="Toggle mute">
                  <IconVolume muted={muted} />
                </button>

                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.02"
                  value={muted ? 0 : volume}
                  onChange={changeVolume}
                  className={styles.volumeSlider}
                  aria-label="Volume"
                />

                <span className={styles.timeDisplay}>
                  {fmtTime(currentTime)} / {fmtTime(duration)}
                </span>
              </div>

              <div className={styles.rightControls}>
                <button className={styles.controlBtn} onClick={toggleFullscreen} aria-label="Fullscreen">
                  <IconFullscreen />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
