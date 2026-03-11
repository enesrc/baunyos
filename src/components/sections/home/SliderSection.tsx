"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react/ssr";
import type { SliderGetPayload } from "@/generated/prisma/models/Slider";

type Slider = SliderGetPayload<Record<string, never>>;

const INTERVAL = 12000; // pan animasyon süresi (ms)
const PAUSE = 1000;     // animasyon bittikten sonra bekleme (ms)
const CYCLE = INTERVAL + PAUSE; // toplam slayt süresi


export default function SliderSection({ sliders }: { sliders: Slider[] }) {
  const active = sliders.filter((s) => s.is_active);
  const total = active.length;

  // ── Mobile: yığın tabanlı, basit 0-tabanlı indeks ─────────────
  const [currentIndex, setCurrentIndex] = useState(0);

  // ── Desktop: klon tabanlı, sonsuz döngü için 1-tabanlı indeks ──
  const [trackIndex, setTrackIndex] = useState(1);
  const [withTransition, setWithTransition] = useState(true);
  const [hovered, setHovered] = useState(false);

  // ── Paylaşılan durum ────────────────────────────────────────────
  const [paused, setPaused] = useState(false);
  const [progressKey, setProgressKey] = useState(0);

  // ── Genel ref'ler ─────────────────────────────────────────────
  const animatingRef = useRef(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const desktopDragX = useRef<number | null>(null);
  const mobileDragX = useRef<number | null>(null);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mobileHoldTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Zamanlayıcı ref'leri (kalan süre takibi) ──────────────────
  const pausedRef = useRef(false);
  const elapsedRef = useRef(0);
  const lastResumeRef = useRef(0);
  const autoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const goRef = useRef<(d: number) => void>(() => { });

  // ── go(): desktop track + mobile stack'i aynı anda ilerletir ───
  const go = useCallback(
    (direction: number) => {
      if (total <= 1) return;

      // Slayt ilerlet
      setCurrentIndex((prev) => (prev + direction + total) % total);
      setProgressKey((k) => k + 1);

      // Zamanlayıcıyı sıfırla — yeni slayt, tam CYCLE
      elapsedRef.current = 0;
      if (autoTimerRef.current) clearTimeout(autoTimerRef.current);
      lastResumeRef.current = Date.now();
      autoTimerRef.current = setTimeout(() => goRef.current(1), CYCLE);

      // Desktop: geçiş animasyonu zaten çalışıyorsa tekrar tetikleme
      if (animatingRef.current) return;
      animatingRef.current = true;
      setWithTransition(true);
      setTrackIndex((prev) => prev + direction);
    },
    [total],
  );

  // goRef her zaman güncel go()'yu tutar (circular dep önler)
  useEffect(() => { goRef.current = go; }, [go]);

  // ── Zamanlayıcı yardımcıları ──────────────────────────────────
  const pauseTimer = useCallback(() => {
    if (pausedRef.current) return;
    pausedRef.current = true;
    setPaused(true);
    if (autoTimerRef.current) {
      clearTimeout(autoTimerRef.current);
      autoTimerRef.current = null;
    }
    elapsedRef.current += Date.now() - lastResumeRef.current;
  }, []);

  const resumeTimer = useCallback(() => {
    if (!pausedRef.current) return;
    pausedRef.current = false;
    setPaused(false);
    const remaining = Math.max(0, CYCLE - elapsedRef.current);
    if (remaining <= 0) {
      goRef.current(1);
    } else {
      lastResumeRef.current = Date.now();
      autoTimerRef.current = setTimeout(() => goRef.current(1), remaining);
    }
  }, []);

  // ── Desktop: transition sonrası klon teleportasyonu ─────────────
  const onTrackTransitionEnd = useCallback(
    (e: React.TransitionEvent) => {
      if (e.target !== trackRef.current) return;
      animatingRef.current = false;
      setTrackIndex((prev) => {
        if (prev <= 0) { setWithTransition(false); return total; }
        if (prev > total) { setWithTransition(false); return 1; }
        return prev;
      });
    },
    [total],
  );

  // ── İlk zamanlayıcıyı başlat ─────────────────────────────────
  useEffect(() => {
    if (total <= 1) return;
    elapsedRef.current = 0;
    lastResumeRef.current = Date.now();
    autoTimerRef.current = setTimeout(() => goRef.current(1), CYCLE);
    return () => {
      if (autoTimerRef.current) clearTimeout(autoTimerRef.current);
    };
  }, [total]);

  // ── Sekme görünürlük değişikliği ──────────────────────────────
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) {
        if (!pausedRef.current && autoTimerRef.current) {
          clearTimeout(autoTimerRef.current);
          autoTimerRef.current = null;
          elapsedRef.current += Date.now() - lastResumeRef.current;
        }
      } else {
        if (!pausedRef.current) {
          const remaining = Math.max(0, CYCLE - elapsedRef.current);
          lastResumeRef.current = Date.now();
          autoTimerRef.current = setTimeout(() => goRef.current(1), remaining);
          setProgressKey((k) => k + 1);
        }
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  // ── Desktop mouse sürükleme / hover işleyicileri ────────────────
  const onDesktopDown = (x: number) => {
    desktopDragX.current = x;
    holdTimer.current = setTimeout(() => pauseTimer(), 80);
  };

  const onDesktopUp = (x: number) => {
    if (holdTimer.current) clearTimeout(holdTimer.current);
    const diff = (desktopDragX.current ?? x) - x;
    desktopDragX.current = null;
    if (Math.abs(diff) > 50) {
      if (pausedRef.current) { pausedRef.current = false; setPaused(false); }
      go(diff > 0 ? 1 : -1);
    } else {
      resumeTimer();
    }
  };

  const onDesktopLeave = () => {
    if (holdTimer.current) clearTimeout(holdTimer.current);
    desktopDragX.current = null;
    resumeTimer();
    setHovered(false);
  };

  // ── Mobile: dokunma, tutma ve kaydırma işleyicileri ───────────

  const onMobileTouchStart = (e: React.TouchEvent) => {
    mobileDragX.current = e.touches[0].clientX;
    mobileHoldTimer.current = setTimeout(() => pauseTimer(), 180);
  };

  const onMobileTouchMove = (e: React.TouchEvent) => {
    if (mobileDragX.current === null) return;
    const moved = Math.abs(e.touches[0].clientX - mobileDragX.current);
    if (moved > 10 && mobileHoldTimer.current) {
      clearTimeout(mobileHoldTimer.current);
      mobileHoldTimer.current = null;
    }
  };

  const onMobileTouchEnd = (e: React.TouchEvent) => {
    if (mobileHoldTimer.current) {
      clearTimeout(mobileHoldTimer.current);
      mobileHoldTimer.current = null;
    }

    if (mobileDragX.current === null || total <= 1) {
      mobileDragX.current = null;
      resumeTimer();
      return;
    }

    const diff = mobileDragX.current - e.changedTouches[0].clientX;
    mobileDragX.current = null;

    if (Math.abs(diff) > 40) {
      if (pausedRef.current) { pausedRef.current = false; setPaused(false); }
      go(diff > 0 ? 1 : -1);
    } else {
      resumeTimer();
    }
  };

  const onMobileTouchCancel = () => {
    if (mobileHoldTimer.current) {
      clearTimeout(mobileHoldTimer.current);
      mobileHoldTimer.current = null;
    }
    mobileDragX.current = null;
    resumeTimer();
  };

  if (!active.length) return null;

  // Desktop: sonsuz döngü için baş ve sona klon eklenir
  const slides = total > 1 ? [active[total - 1], ...active, active[0]] : active;
  const slideCount = slides.length;
  const trackOffset = (trackIndex / slideCount) * 100;

  return (
    <section className="w-full select-none dark:bg-dark-7">

      {/* ═══════════════ DESKTOP ═══════════════════════════════════
          Klon track yaklaşımı — hover'da yuvarlak oklar + progress bar
      ══════════════════════════════════════════════════════════ */}
      <div
        className="relative hidden w-full overflow-hidden sm:block"
        style={{ aspectRatio: "1905 / 720" }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={onDesktopLeave}
        onMouseDown={(e) => onDesktopDown(e.clientX)}
        onMouseUp={(e) => onDesktopUp(e.clientX)}
      >
        {/* Slide track */}
        <div
          ref={trackRef}
          className={`absolute inset-0 flex ease-in-out ${withTransition ? "duration-500" : "duration-0"
            }`}
          style={{
            width: `${slideCount * 100}%`,
            transform: `translateX(-${trackOffset}%)`,
          }}
          onTransitionEnd={onTrackTransitionEnd}
        >
          {slides.map((slide, i) => (
            <div
              key={`${slide.id}-${i}`}
              className="relative h-full shrink-0"
              style={{ width: `${100 / slideCount}%` }}
            >
              <Image
                src={slide.image_url}
                alt={slide.title_tr}
                fill
                sizes="(max-width: 639px) 1vw, 100vw"
                className="object-cover object-center"
                draggable={false}
              />
            </div>
          ))}
        </div>

        {/* Çoklu slayt kontrolleri */}
        {total > 1 && (
          <>
            {/* Hover geçiş örtüsü */}
            <div
              className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${hovered ? "opacity-100" : "opacity-0"
                }`}
            >
              <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-dark-7/40 to-transparent" />
              <div className="absolute inset-y-0 left-0 w-24 bg-linear-to-r from-dark-7/40 to-transparent" />
              <div className="absolute inset-y-0 right-0 w-24 bg-linear-to-l from-dark-7/40 to-transparent" />
            </div>

            {/* ← Önceki — yuvarlak, hover: açık=cyan-dull / koyu=cyan */}
            <button
              onClick={() => go(-1)}
              aria-label="Önceki"
              className={`absolute left-5 top-1/2 flex h-10 w-10 items-center justify-center
                rounded-full border border-white/40 bg-white/10 text-white backdrop-blur-sm
                transition-all duration-200 ease-out
                hover:border-cyan-dull hover:bg-cyan-dull
                dark:hover:border-cyan dark:hover:bg-cyan
                ${hovered
                  ? "-translate-y-1/2 translate-x-0 opacity-100"
                  : "-translate-y-1/2 -translate-x-[calc(100%+20px)] opacity-0"
                }`}
            >
              <ArrowLeftIcon size={20} />
            </button>

            {/* Sonraki → — yuvarlak, hover: açık=cyan-dull / koyu=cyan */}
            <button
              onClick={() => go(1)}
              aria-label="Sonraki"
              className={`absolute right-5 top-1/2 flex h-10 w-10 items-center justify-center
                rounded-full border border-white/40 bg-white/10 text-white backdrop-blur-sm
                transition-all duration-200 ease-out
                hover:border-cyan-dull hover:bg-cyan-dull
                dark:hover:border-cyan dark:hover:bg-cyan
                ${hovered
                  ? "-translate-y-1/2 translate-x-0 opacity-100"
                  : "-translate-y-1/2 translate-x-[calc(100%+20px)] opacity-0"
                }`}
            >
              <ArrowRightIcon size={20} />
            </button>

            {/* Desktop progress bar */}
            <div
              className={`absolute bottom-6 left-1/2 h-0.5 w-24 -translate-x-1/2 bg-white/25
                transition-all duration-200 ease-out
                ${hovered
                  ? "translate-y-0 opacity-100"
                  : "translate-y-[calc(100%+24px)] opacity-0"
                }`}
            >
              <div
                key={progressKey}
                className="absolute inset-y-0 left-0 w-0 bg-light-1"
                style={{
                  animationName: paused ? "none" : "sliderProgress",
                  animationDuration: `${CYCLE}ms`,
                  animationTimingFunction: "linear",
                  animationFillMode: "forwards",
                }}
              />
            </div>
          </>
        )}
      </div>

      {/* ═══════════════ MOBILE ════════════════════════════════════
          Yığın (stack) yaklaşımı — aktif slayta Ken Burns efekti
          Gezinti: parmakla sola/sağa kaydırma, buton yok
      ══════════════════════════════════════════════════════════ */}
      <div
        className="relative w-full touch-none overflow-hidden sm:hidden"
        style={{ aspectRatio: "4 / 3" }}
        onTouchStart={onMobileTouchStart}
        onTouchMove={onMobileTouchMove}
        onTouchEnd={onMobileTouchEnd}
        onTouchCancel={onMobileTouchCancel}
        onContextMenu={(e) => e.preventDefault()}
      >
        {active.map((slide, i) => {
          const isActive = i === currentIndex;

          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${isActive ? "z-10 opacity-100" : "z-0 opacity-0"
                }`}
            >
              <Image
                key={isActive ? `active-${progressKey}` : "idle"}
                src={slide.image_url}
                alt={slide.title_tr}
                fill
                sizes="(min-width: 640px) 1vw, 100vw"
                className="object-cover"
                style={isActive ? {
                  animationName: "mobilePanLR",
                  animationDuration: `${INTERVAL}ms`,
                  animationTimingFunction: "linear",
                  animationFillMode: "forwards",
                  animationPlayState: paused ? "paused" : "running",
                } : undefined}
                draggable={false}
              />
            </div>
          );
        })}

        {/* Süre çubuğu — tam genişlik, alt kenar */}
        {total > 1 && (
          <div className="absolute bottom-0 left-0 right-0 z-20 h-1 bg-transparent">
            <div
              key={progressKey}
              className="absolute inset-y-0 left-0 w-0 bg-cyan-bright"
              style={{
                animationName: "sliderProgress",
                animationDuration: `${CYCLE}ms`,
                animationTimingFunction: "linear",
                animationFillMode: "forwards",
                animationPlayState: paused ? "paused" : "running",
              }}
            />
          </div>
        )}
      </div>

      <style>{`
        @keyframes sliderProgress {
          from { width: 0%   }
          to   { width: 100% }
        }

        @keyframes mobilePanLR {
          0%   { object-position: 0% 50%;   transform: scale(1.02); }
          100% { object-position: 100% 50%; transform: scale(1.08); }
        }
      `}</style>
    </section>
  );
}
