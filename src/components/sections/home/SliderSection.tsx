"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { SliderGetPayload } from "@/generated/prisma/models/Slider";

type Slider = SliderGetPayload<Record<string, never>>;

const INTERVAL = 8000;

export default function SliderSection({ sliders }: { sliders: Slider[] }) {
  const active = sliders.filter((s) => s.is_active);
  const total = active.length;

  const [trackIndex, setTrackIndex] = useState(1);
  const [withTransition, setWithTransition] = useState(true);
  const [paused, setPaused] = useState(false);
  const [progressKey, setProgressKey] = useState(0);
  const [hovered, setHovered] = useState(false);

  const animatingRef = useRef(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragStartX = useRef<number | null>(null);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const go = useCallback(
    (direction: number) => {
      if (animatingRef.current || total <= 1) return;
      animatingRef.current = true;
      setWithTransition(true);
      setTrackIndex((prev) => prev + direction);
      setProgressKey((k) => k + 1);
    },
    [total],
  );

  const onTrackTransitionEnd = useCallback(
    (e: React.TransitionEvent) => {
      if (e.target !== trackRef.current) return;
      animatingRef.current = false;

      setTrackIndex((prev) => {
        if (prev <= 0) {
          setWithTransition(false);
          return total;
        }
        if (prev > total) {
          setWithTransition(false);
          return 1;
        }
        return prev;
      });
    },
    [total],
  );

  useEffect(() => {
    if (total <= 1 || paused) return;
    if (typeof document !== "undefined" && document.hidden) return;
    const t = setTimeout(() => go(1), INTERVAL);
    return () => clearTimeout(t);
  }, [go, trackIndex, total, paused, progressKey]);

  useEffect(() => {
    const handler = () => {
      if (!document.hidden) setProgressKey((k) => k + 1);
    };
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, []);

  const onDown = (x: number) => {
    dragStartX.current = x;
    holdTimer.current = setTimeout(() => setPaused(true), 80);
  };

  const onUp = (x: number) => {
    if (holdTimer.current) clearTimeout(holdTimer.current);
    setPaused(false);
    const diff = (dragStartX.current ?? x) - x;
    if (Math.abs(diff) > 50) go(diff > 0 ? 1 : -1);
    dragStartX.current = null;
  };

  const onLeave = () => {
    if (holdTimer.current) clearTimeout(holdTimer.current);
    dragStartX.current = null;
    setPaused(false);
    setHovered(false);
  };

  if (!active.length) return null;

  const slides = total > 1 ? [active[total - 1], ...active, active[0]] : active;
  const slideCount = slides.length;
  const trackOffset = (trackIndex / slideCount) * 100;

  /* 1905:720 oran = %37.795... */
  return (
    <section className="w-full select-none dark:bg-dark-3">
      <div
        className="relative mx-auto w-full max-w-7xl overflow-hidden"
        style={{ aspectRatio: "1905 / 720" }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={onLeave}
        onMouseDown={(e) => onDown(e.clientX)}
        onMouseUp={(e) => onUp(e.clientX)}
        onTouchStart={(e) => {
          setHovered(true);
          onDown(e.touches[0].clientX);
        }}
        onTouchEnd={(e) => {
          onUp(e.changedTouches[0].clientX);
          setHovered(false);
        }}
      >
        {/* Slide track */}
        <div
          ref={trackRef}
          className={`absolute inset-0 flex ease-in-out ${withTransition ? "duration-500" : "duration-0"}`}
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
                className="object-cover object-center"
                priority={i <= 1}
                draggable={false}
              />
            </div>
          ))}
        </div>

        {/* Scrim */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-x-0 top-0 h-24 bg-linear-to-b from-dark-4/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-dark-4/20 to-transparent" />
          <div className="absolute inset-y-0 left-0 w-24 bg-linear-to-r from-dark-4/40 to-transparent" />
          <div className="absolute inset-y-0 right-0 w-24 bg-linear-to-l from-dark-4/40 to-transparent" />
        </div>

        {/* Oklar + Progress: sadece çoklu slaytlarda */}
        {total > 1 && (
          <>
            <button
              onClick={() => go(-1)}
              aria-label="Önceki"
              className={`absolute left-5 top-1/2 flex h-10 w-10 items-center justify-center rounded-md border border-gray-1/50 bg-transparent text-white transition-all duration-200 ease-out hover:border-teal-2 hover:bg-teal-2 hover:text-white dark:hover:border-teal-2 dark:hover:bg-teal-2 dark:hover:text-white ${
                hovered
                  ? "-translate-y-1/2 translate-x-0 opacity-100"
                  : "-translate-y-1/2 -translate-x-[calc(100%+20px)] opacity-0"
              }`}
            >
              <ArrowLeft size={21} strokeWidth={2} />
            </button>

            <button
              onClick={() => go(1)}
              aria-label="Sonraki"
              className={`absolute right-5 top-1/2 flex h-10 w-10 items-center justify-center rounded-md border border-gray-1/50 bg-transparent text-white transition-all duration-200 ease-out hover:border-teal-2 hover:bg-teal-2 hover:text-white dark:hover:border-teal-2 dark:hover:bg-teal-2 dark:hover:text-white ${
                hovered
                  ? "-translate-y-1/2 translate-x-0 opacity-100"
                  : "-translate-y-1/2 translate-x-[calc(100%+20px)] opacity-0"
              }`}
            >
              <ArrowRight size={21} strokeWidth={2} />
            </button>

            <div
              className={`absolute bottom-6 left-1/2 h-0.5 w-24 -translate-x-1/2 bg-white/25 transition-all duration-200 ease-out ${
                hovered
                  ? "translate-y-0 opacity-100"
                  : "translate-y-[calc(100%+24px)] opacity-0"
              }`}
            >
              <div
                key={progressKey}
                className="absolute inset-y-0 left-0 w-0 bg-light-1"
                style={{
                  animationName: paused ? "none" : "sliderProgress",
                  animationDuration: `${INTERVAL}ms`,
                  animationTimingFunction: "linear",
                  animationFillMode: "forwards",
                }}
              />
            </div>
          </>
        )}

        <style>{`
          @keyframes sliderProgress { from { width: 0% } to { width: 100% } }
        `}</style>
      </div>
    </section>
  );
}