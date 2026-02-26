'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { GlobeIntroScene } from '@/features/globe/GlobeIntroScene';
import type { GlobePosition } from '@/features/globe/GlobeIntroScene';

type Phase = 'idle' | 'filling' | 'animating' | 'entering' | 'done';

interface GlobeIntroOverlayProps {
  onComplete: () => void;
}

const BAR_FILL_SCROLL   = 300;
const ANIM_DURATION_MS  = 2800;
const ENTER_DURATION_MS = 1400;
const ANIM_STEPS        = 120;

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export function GlobeIntroOverlay({ onComplete }: GlobeIntroOverlayProps) {
  const [phase,         setPhase]         = useState<Phase>('idle');
  const [barFill,       setBarFill]       = useState(0);
  const [globeProgress, setGlobeProgress] = useState(0);
  const [windowSize,    setWindowSize]    = useState({ w: 1920, h: 1080 });
  const [startPos,      setStartPos]      = useState({ lat: 15.0, lng: 5.0, alt: 2.5 });

  // Scene her idle frame'de buna yazar — trigger anında okuruz
  const positionRef = useRef<GlobePosition>({ lat: 15.0, lng: 5.0, alt: 2.5 });

  const barAccumRef   = useRef(0);
  const phaseRef      = useRef<Phase>('idle');
  const lockedRef     = useRef(false);   // animasyon başlayınca true → scroll tamamen engellenir
  const animRef       = useRef<number>(0);
  const enteringRef   = useRef(false);
  const touchStartRef = useRef(0);

  const setPhaseSync = (p: Phase) => { phaseRef.current = p; setPhase(p); };

  // ── Window size ──────────────────────────────────────────────
  useEffect(() => {
    const update = () => setWindowSize({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // ── Body scroll kilidi ───────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  // ── Enter animasyonu ─────────────────────────────────────────
  const triggerEnter = useCallback(() => {
    if (enteringRef.current) return;
    enteringRef.current = true;
    setPhaseSync('entering');
    setTimeout(() => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      setPhaseSync('done');
      onComplete();
    }, ENTER_DURATION_MS);
  }, [onComplete]);

  // ── Globe animasyonu ─────────────────────────────────────────
  const startGlobeAnimation = useCallback(() => {
    if (lockedRef.current) return;

    // Scroll'u tamamen kilitle
    lockedRef.current = true;

    // Scene'in yazdığı güncel pozisyonu oku — gerçek idle yeri
    const { lat, lng, alt } = positionRef.current;
    setStartPos({ lat, lng, alt });
    setPhaseSync('animating');

    let step = 0;
    const interval = ANIM_DURATION_MS / ANIM_STEPS;

    animRef.current = window.setInterval(() => {
      step++;
      const eased = easeInOutCubic(Math.min(1, step / ANIM_STEPS));
      setGlobeProgress(eased);
      if (step >= ANIM_STEPS) {
        clearInterval(animRef.current);
        setTimeout(() => triggerEnter(), 600);
      }
    }, interval);
  }, [triggerEnter]);

  // ── Scroll → bar fill ────────────────────────────────────────
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    if (lockedRef.current) return;     // animasyon sırasında tamamen yoksay
    if (e.deltaY <= 0) return;         // scroll up yoksay

    barAccumRef.current = Math.min(BAR_FILL_SCROLL, barAccumRef.current + e.deltaY);
    const fill = barAccumRef.current / BAR_FILL_SCROLL;
    setBarFill(fill);
    if (phaseRef.current === 'idle') setPhaseSync('filling');
    if (fill >= 1) startGlobeAnimation();
  }, [startGlobeAnimation]);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    touchStartRef.current = e.touches[0].clientY;
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    e.preventDefault();
    if (lockedRef.current) return;
    const dy = touchStartRef.current - e.touches[0].clientY;
    touchStartRef.current = e.touches[0].clientY;
    if (dy <= 0) return;

    barAccumRef.current = Math.min(BAR_FILL_SCROLL, barAccumRef.current + dy * 2.5);
    const fill = barAccumRef.current / BAR_FILL_SCROLL;
    setBarFill(fill);
    if (phaseRef.current === 'idle') setPhaseSync('filling');
    if (fill >= 1) startGlobeAnimation();
  }, [startGlobeAnimation]);

  useEffect(() => {
    window.addEventListener('wheel',      handleWheel,      { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove',  handleTouchMove,  { passive: false });
    return () => {
      window.removeEventListener('wheel',      handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove',  handleTouchMove);
      clearInterval(animRef.current);
    };
  }, [handleWheel, handleTouchStart, handleTouchMove]);

  if (phase === 'done') return null;

  const isAnimating  = phase === 'animating' || phase === 'entering';
  const isEntering   = phase === 'entering';
  const titleOpacity = isAnimating ? 0 : 1;
  const hintOpacity  = phase === 'idle' ? 1 : 0;
  const bkrOpacity   = isAnimating && globeProgress > 0.82
    ? Math.min(1, (globeProgress - 0.82) / 0.12) : 0;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden',
      background: 'radial-gradient(ellipse at 50% 60%, #0a2744 0%, #061525 50%, #020d1a 100%)',
      opacity:       isEntering ? 0 : 1,
      transition:    isEntering ? `opacity ${ENTER_DURATION_MS}ms cubic-bezier(0.4,0,0.2,1)` : 'none',
      pointerEvents: isEntering ? 'none' : 'auto',
    }}>

      {/* Globe */}
      <div style={{
        transform:  isEntering ? 'scale(8)' : 'scale(1)',
        transition: isEntering ? `transform ${ENTER_DURATION_MS}ms cubic-bezier(0.4,0,0.2,1)` : 'none',
        willChange: 'transform',
      }}>
        <GlobeIntroScene
          progress={globeProgress}
          isAnimating={isAnimating}
          startLat={startPos.lat}
          startLng={startPos.lng}
          startAlt={startPos.alt}
          width={windowSize.w}
          height={windowSize.h}
          positionRef={positionRef}
        />
      </div>

      {/* Kapak başlığı */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none',
        opacity: titleOpacity, transition: 'opacity 0.7s ease',
        zIndex: 1, gap: '0.6rem',
      }}>
        <p style={{
          fontSize: 'clamp(1.15rem, 2.6vw, 2rem)', fontWeight: 700,
          letterSpacing: '0.18em', textTransform: 'uppercase',
          color: 'rgba(96,180,255,0.9)', margin: 0, textAlign: 'center',
        }}>
          Balıkesir University
        </p>
        <h1 style={{
          fontSize: 'clamp(3rem, 8.5vw, 9rem)', fontWeight: 800,
          lineHeight: 1.0, letterSpacing: '-0.02em',
          textAlign: 'center', whiteSpace: 'nowrap',
          margin: 0, padding: '0 1rem',
          background: 'linear-gradient(160deg, #ffffff 30%, #a8d8ff 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          International Students
        </h1>
        <p style={{
          fontSize: 'clamp(0.8rem, 1.4vw, 1rem)', fontWeight: 300,
          letterSpacing: '0.08em', color: 'rgba(255,255,255,0.4)', margin: 0,
        }}>
          Scroll down to explore
        </p>
      </div>

      {/* Balıkesir lokasyon */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center', pointerEvents: 'none',
        opacity: bkrOpacity, transition: 'opacity 0.2s ease',
        zIndex: 2,
      }}>
        <p style={{
          fontSize: '0.65rem', letterSpacing: '0.3em',
          textTransform: 'uppercase', color: '#60b4ff', marginBottom: '0.3rem',
        }}>● Balıkesir, Türkiye</p>
        <p style={{
          fontSize: '1.1rem', fontWeight: 300,
          color: 'rgba(255,255,255,0.85)', letterSpacing: '0.05em',
        }}>Balıkesir Üniversitesi</p>
      </div>

      {/* Scroll hint */}
      <div style={{
        position: 'absolute', bottom: '5.5rem', left: '50%',
        transform: 'translateX(-50%)',
        opacity: hintOpacity, transition: 'opacity 0.4s ease',
        pointerEvents: 'none',
      }}>
        <DownArrow />
      </div>

      {/* Progress bar */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: 'rgba(255,255,255,0.08)' }}>
        <div style={{
          height: '100%',
          width: isAnimating ? '100%' : `${barFill * 100}%`,
          background: 'linear-gradient(to right, #1e6fb5, #60b4ff, #a8d8ff)',
          transition: isAnimating ? 'width 0.3s ease' : 'width 0.05s linear',
          boxShadow: '0 0 10px rgba(96,180,255,0.7)',
        }} />
      </div>
    </div>
  );
}

function DownArrow() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
      style={{ animation: 'bauBounce 1.8s ease-in-out infinite' }}>
      <path d="M12 5v14M5 12l7 7 7-7"
        stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}