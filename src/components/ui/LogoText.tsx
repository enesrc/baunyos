"use client";

import { useRef, useEffect } from "react";

export default function LogoText({
  line1,
  line2,
  color,
}: {
  line1: string;
  line2: string;
  color: string;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const els = [line1Ref.current, line2Ref.current].filter(Boolean) as HTMLSpanElement[];
    if (!els.length) return;

    let rafId: number;
    let timerId: ReturnType<typeof setTimeout>;
    let destroyed = false;

    const doPass = (onDone: () => void) => {
      const start = performance.now();
      const animate = (now: number) => {
        if (destroyed) return;
        const t = Math.min((now - start) / 600, 1);
        const pos = `${250 - t * 300}% 0`;
        els.forEach(el => (el.style.backgroundPosition = pos));
        if (t < 1) {
          rafId = requestAnimationFrame(animate);
        } else {
          els.forEach(el => (el.style.backgroundPosition = "250% 0"));
          onDone();
        }
      };
      rafId = requestAnimationFrame(animate);
    };

    const runCycle = () => {
      if (destroyed) return;
      doPass(() => {
        if (!destroyed) timerId = setTimeout(runCycle, 10000);
      });
    };

    timerId = setTimeout(runCycle, 500);

    return () => {
      destroyed = true;
      cancelAnimationFrame(rafId);
      clearTimeout(timerId);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="logo-text-wrapper">
      <span ref={line1Ref} className="logo-line logo-spread logo-shimmer" aria-label={line1}>
        {line1.split("").map((ch, i) => (
          <span key={i}>{ch}</span>
        ))}
      </span>
      <span ref={line2Ref} className="logo-line logo-shimmer" aria-label={line2}>
        {line2}
      </span>

      <style jsx>{`
        .logo-text-wrapper {
          display: flex;
          flex-direction: column;
          max-width: 100%;
          overflow: hidden;
        }
        .logo-line {
          display: block;
          font-weight: 700;
          text-transform: uppercase;
          line-height: 1.15;
          font-size: clamp(0.7rem, 1.3vw, 1.4rem);
          white-space: nowrap;
        }
        .logo-spread {
          display: flex;
          justify-content: space-between;
        }
        .logo-shimmer {
          background: linear-gradient(
            150deg,
            ${color} 0%, ${color} 35%,
            ${color}99 45%, #fff 50%, ${color}99 55%,
            ${color} 65%, ${color} 100%
          );
          background-size: 300% 100%;
          background-position: 250% 0;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
    </div>
  );
}