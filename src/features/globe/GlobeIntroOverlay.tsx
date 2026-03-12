'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { GlobeIntroScene } from '@/features/globe/GlobeIntroScene';
import type { GlobePosition } from '@/features/globe/GlobeIntroScene';
import ParallelMarquee from './ParallelMarquee';
import LoadingScreen from '@/components/sections/home/LoadingScreen';

type Phase = 'loading' | 'idle' | 'animating' | 'entering' | 'done';

const AUTO_START_MS = 3000;
const ANIM_DURATION_MS = 2800;
const ANIM_STEPS = 120;
const ENTER_DURATION_MS = 1400;
const ENTER_STEPS = 60;
const FEATHER = 80;
const FALLBACK_MS = 8000;

const BG = 'radial-gradient(ellipse at 50% 55%, #0d2a42 0%, #081a2e 40%, #040e1a 100%)';

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export function GlobeIntroOverlay({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<Phase>('loading');
  const [globeProgress, setGlobeProgress] = useState(0);
  const [windowSize, setWindowSize] = useState({ w: 1920, h: 1080 });
  const [startPos, setStartPos] = useState({ lat: 15.0, lng: 5.0, alt: 2.5 });
  const [revealRadius, setRevealRadius] = useState(0);
  const [globeReady, setGlobeReady] = useState(false);

  const positionRef = useRef<GlobePosition>({ lat: 15.0, lng: 5.0, alt: 2.5 });
  const phaseRef = useRef<Phase>('loading');
  const animRef = useRef(0);
  const enteringRef = useRef(false);
  const fallbackRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setPhaseSync = useCallback((p: Phase) => { phaseRef.current = p; setPhase(p); }, []);

  /* ── Globe ready: callback + fallback timer ─────────────────── */

  const handleGlobeReady = useCallback(() => {
    if (fallbackRef.current) { clearTimeout(fallbackRef.current); fallbackRef.current = null; }
    setGlobeReady(true);
  }, []);

  // Fallback: globe hiç sinyal göndermezse 8sn sonra zorla geç
  useEffect(() => {
    fallbackRef.current = setTimeout(() => {
      // Globe yüklenemedi — intro'yu tamamen atla, siteye geç
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      setPhaseSync('done');
      onComplete();
    }, FALLBACK_MS);

    return () => { if (fallbackRef.current) clearTimeout(fallbackRef.current); };
  }, []);

  const handleLoadingDone = useCallback(() => setPhaseSync('idle'), [setPhaseSync]);

  /* ── Window resize ──────────────────────────────────────────── */

  useEffect(() => {
    const u = () => setWindowSize({ w: innerWidth, h: innerHeight });
    u();
    addEventListener('resize', u);
    return () => removeEventListener('resize', u);
  }, []);

  /* ── Scroll kilidi ──────────────────────────────────────────── */

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; document.documentElement.style.overflow = ''; };
  }, []);

  useEffect(() => {
    const block = (e: Event) => e.preventDefault();
    const o: AddEventListenerOptions = { passive: false, capture: true };
    addEventListener('wheel', block, o);
    addEventListener('touchmove', block, o);
    return () => {
      removeEventListener('wheel', block, o as EventListenerOptions);
      removeEventListener('touchmove', block, o as EventListenerOptions);
    };
  }, []);

  /* ── Circular reveal → done ─────────────────────────────────── */

  const triggerEnter = useCallback(() => {
    if (enteringRef.current) return;
    enteringRef.current = true;
    setPhaseSync('entering');

    const maxR = Math.hypot(innerWidth, innerHeight) / 2 + 100;
    let step = 0;

    const id = setInterval(() => {
      step++;
      setRevealRadius(easeInOutCubic(Math.min(1, step / ENTER_STEPS)) * maxR);
      if (step >= ENTER_STEPS) {
        clearInterval(id);
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        setPhaseSync('done');
        onComplete();
      }
    }, ENTER_DURATION_MS / ENTER_STEPS);
  }, [onComplete, setPhaseSync]);

  /* ── Zoom animasyonu ────────────────────────────────────────── */

  const startZoom = useCallback(() => {
    setStartPos({ ...positionRef.current });
    setPhaseSync('animating');
    let step = 0;

    animRef.current = window.setInterval(() => {
      step++;
      setGlobeProgress(easeInOutCubic(Math.min(1, step / ANIM_STEPS)));
      if (step >= ANIM_STEPS) {
        clearInterval(animRef.current);
        setTimeout(triggerEnter, 400);
      }
    }, ANIM_DURATION_MS / ANIM_STEPS);
  }, [triggerEnter, setPhaseSync]);

  /* ── Auto-start: idle'a geçince sayaç başlat ────────────────── */

  useEffect(() => {
    if (phase !== 'idle') return;
    const t = setTimeout(() => { if (phaseRef.current === 'idle') startZoom(); }, AUTO_START_MS);
    return () => clearTimeout(t);
  }, [phase, startZoom]);

  /* ── Cleanup ────────────────────────────────────────────────── */

  useEffect(() => () => clearInterval(animRef.current), []);

  if (phase === 'done') return null;

  /* ── Türetilmiş değerler ────────────────────────────────────── */

  const isAnimating = phase === 'animating' || phase === 'entering';
  const isEntering = phase === 'entering';
  const contentVisible = phase !== 'loading';

  const logoOpacity = isAnimating && globeProgress > 0.82
    ? Math.min(1, (globeProgress - 0.82) / 0.12)
    : 0;

  const mask = isEntering
    ? `radial-gradient(circle at 50% 50%, transparent ${revealRadius}px, rgba(0,0,0,0.3) ${revealRadius + FEATHER * 0.4}px, black ${revealRadius + FEATHER}px)`
    : undefined;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: -1,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden', background: BG,
      pointerEvents: isEntering ? 'none' : 'auto',
      WebkitMaskImage: mask, maskImage: mask,
    }}>
      {/* Globe + Marquee */}
      <div style={{ opacity: contentVisible ? 1 : 0, transition: 'opacity 0.6s ease' }}>
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
        {contentVisible && <ParallelMarquee />}
      </div>

      {/* Lokasyon logosu — zoom sonunda belirir */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        opacity: logoOpacity, transition: 'opacity 0.3s ease',
        zIndex: 2,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logos/baun-logo.png"
          alt="Balıkesir Üniversitesi"
          style={{
            width: 'clamp(48px, 6vw, 80px)', height: 'auto',
            objectFit: 'contain',
            filter: 'drop-shadow(0 0 24px rgba(0,148,192,0.5)) drop-shadow(0 2px 12px rgba(0,0,0,0.6))',
          }}
        />
      </div>

      {/* Loading Screen */}
      {phase === 'loading' && (
        <LoadingScreen isReady={globeReady} onFadeOutDone={handleLoadingDone} />
      )}

      {/* Idle pulse */}
      {phase === 'idle' && (
        <div style={{
          position: 'absolute', bottom: '3rem', left: '50%',
          transform: 'translateX(-50%)', opacity: 0.5, pointerEvents: 'none',
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