'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { GlobeIntroScene } from '@/features/globe/GlobeIntroScene';
import type { GlobePosition } from '@/features/globe/GlobeIntroScene';
import ParallelMarquee from './ParallelMarquee';
import LoadingScreen from '@/components/sections/home/LoadingScreen';

type Phase = 'loading' | 'idle' | 'animating' | 'entering' | 'done';

interface GlobeIntroOverlayProps {
  onComplete: () => void;
}

const AUTO_START_MS = 2000;
const ANIM_DURATION_MS = 2800;
const ENTER_DURATION_MS = 1400;
const ANIM_STEPS = 120;

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export function GlobeIntroOverlay({ onComplete }: GlobeIntroOverlayProps) {
  const [phase, setPhase] = useState<Phase>('loading');
  const [globeProgress, setGlobeProgress] = useState(0);
  const [windowSize, setWindowSize] = useState({ w: 1920, h: 1080 });
  const [startPos, setStartPos] = useState({ lat: 15.0, lng: 5.0, alt: 2.5 });
  const [revealRadius, setRevealRadius] = useState(0);
  const [globeReady, setGlobeReady] = useState(false);

  const positionRef = useRef<GlobePosition>({ lat: 15.0, lng: 5.0, alt: 2.5 });
  const phaseRef = useRef<Phase>('loading');
  const animRef = useRef<number>(0);
  const enteringRef = useRef(false);

  const setPhaseSync = (p: Phase) => { phaseRef.current = p; setPhase(p); };

  const handleGlobeReady = useCallback(() => {
    setGlobeReady(true);
  }, []);

  const handleLoadingFadeOutDone = useCallback(() => {
    setPhaseSync('idle');
  }, []);

  useEffect(() => {
    const update = () => setWindowSize({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    const block = (e: Event) => e.preventDefault();
    const opts: AddEventListenerOptions = { passive: false, capture: true };
    window.addEventListener('wheel', block, opts);
    window.addEventListener('touchmove', block, opts);
    return () => {
      window.removeEventListener('wheel', block, opts as EventListenerOptions);
      window.removeEventListener('touchmove', block, opts as EventListenerOptions);
    };
  }, []);

  const triggerEnter = useCallback(() => {
    if (enteringRef.current) return;
    enteringRef.current = true;
    setPhaseSync('entering');

    const maxR = Math.hypot(window.innerWidth, window.innerHeight) / 2 + 100;
    const steps = 60;
    const interval = ENTER_DURATION_MS / steps;
    let step = 0;

    const id = window.setInterval(() => {
      step++;
      const t = easeInOutCubic(Math.min(1, step / steps));
      setRevealRadius(t * maxR);
      if (step >= steps) {
        clearInterval(id);
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        setPhaseSync('done');
        onComplete();
      }
    }, interval);
  }, [onComplete]);

  const startGlobeAnimation = useCallback(() => {
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
        setTimeout(() => triggerEnter(), 400);
      }
    }, interval);
  }, [triggerEnter]);

  useEffect(() => {
    if (phase !== 'idle') return;
    const t = setTimeout(() => {
      if (phaseRef.current === 'idle') startGlobeAnimation();
    }, AUTO_START_MS);
    return () => clearTimeout(t);
  }, [phase, startGlobeAnimation]);

  useEffect(() => {
    return () => clearInterval(animRef.current);
  }, []);

  if (phase === 'done') return null;

  const isAnimating = phase === 'animating' || phase === 'entering';
  const isEntering = phase === 'entering';
  const bkrOpacity = isAnimating && globeProgress > 0.82
    ? Math.min(1, (globeProgress - 0.82) / 0.12) : 0;

  const feather = 80;
  const maskStyle = isEntering
    ? `radial-gradient(circle at 50% 50%, transparent ${revealRadius}px, rgba(0,0,0,0.3) ${revealRadius + feather * 0.4}px, black ${revealRadius + feather}px)`
    : undefined;

  const contentVisible = phase !== 'loading';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        /* ★ Loading ile aynı koyu navy arka plan */
        background: 'radial-gradient(ellipse at 50% 55%, #0d2a42 0%, #081a2e 40%, #040e1a 100%)',
        pointerEvents: isEntering ? 'none' : 'auto',
        WebkitMaskImage: maskStyle,
        maskImage: maskStyle,
      }}
    >
      {/* Globe + Marquee */}
      <div style={{
        opacity: contentVisible ? 1 : 0,
        transition: 'opacity 0.6s ease',
      }}>
        <div style={{
          transform: isEntering ? 'scale(8)' : 'scale(1)',
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
            onGlobeReady={handleGlobeReady}
          />
        </div>

        {phase !== 'loading' && <ParallelMarquee />}
      </div>

      {/* Balıkesir lokasyon — teal renk şeması */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center', pointerEvents: 'none',
        opacity: bkrOpacity, transition: 'opacity 0.2s ease',
        zIndex: 2,
      }}>
        <p style={{
          fontSize: 'clamp(0.7rem, 1vw, 0.85rem)',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: '#0094c0',
          marginBottom: '0.5rem',
          textShadow: '0 0 12px rgba(0,148,192,0.6)',
        }}>
          ● Balıkesir, Türkiye
        </p>
        <p style={{
          fontSize: 'clamp(1.4rem, 2.8vw, 2.2rem)',
          fontWeight: 600,
          color: '#ffffff',
          letterSpacing: '0.06em',
          textShadow: '0 2px 20px rgba(0,0,0,0.6), 0 0 40px rgba(0,148,192,0.3)',
          lineHeight: 1.3,
        }}>
          Balıkesir Üniversitesi
        </p>
      </div>

      {/* Loading Screen */}
      {phase === 'loading' && (
        <LoadingScreen
          isReady={globeReady}
          onFadeOutDone={handleLoadingFadeOutDone}
        />
      )}

      {phase === 'idle' && (
        <div style={{
          position: 'absolute', bottom: '3rem', left: '50%',
          transform: 'translateX(-50%)',
          opacity: 0.5, pointerEvents: 'none',
        }}>
          <div style={{
            width: 6, height: 6, borderRadius: '50%',
            background: 'rgba(0,148,192,0.8)',
            animation: 'bauPulse 1.6s ease-in-out infinite',
          }} />
        </div>
      )}

      <style>{`
        @keyframes bauPulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.8); }
        }
      `}</style>
    </div>
  );
}