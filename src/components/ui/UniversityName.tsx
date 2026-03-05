"use client";

import { useRef, useEffect, useState } from "react";

export default function UniversityName({
  line1,
  line2,
}: {
  line1: string;
  line2: string;
}) {
  const line2Ref = useRef<HTMLSpanElement>(null);
  const [width, setWidth] = useState<number>(0);

  useEffect(() => {
    const el = line2Ref.current;
    if (!el) return;

    const measure = () => {
      if (line2Ref.current) {
        setWidth(line2Ref.current.offsetWidth);
      }
    };

    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="uni-name-wrapper hidden md:flex md:flex-col">
      <span
        className="uni-name-line uni-name-spread uni-name-shimmer"
        aria-label={line1}
        style={{ width: width > 0 ? `${width}px` : "auto" }}
      >
        {line1.split("").map((ch, i) => (
          <span key={i}>{ch}</span>
        ))}
      </span>

      <span
        ref={line2Ref}
        className="uni-name-line uni-name-shimmer"
        aria-label={line2}
      >
        {line2}
      </span>

      <style jsx>{`
        .uni-name-wrapper {
          position: relative;
        }

        .uni-name-line {
          display: block;
          font-weight: 800;
          text-transform: uppercase;
          line-height: 1.15;
          font-size: clamp(1rem, 1.5vw, 1.5rem);
          color: #1b706e;
          white-space: nowrap;
          letter-spacing: 0.02em;
        }

        .uni-name-spread {
          display: flex;
          justify-content: space-between;
        }

        .uni-name-shimmer {
          background: linear-gradient(
            105deg,
            #1b706e 0%,
            #1b706e 35%,
            #3abfb0 45%,
            #ffffff 50%,
            #3abfb0 55%,
            #1b706e 65%,
            #1b706e 100%
          );
          background-size: 250% 100%;
          background-position: 200% 0;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer-text 4s ease-in-out infinite;
        }

        @keyframes shimmer-text {
          0%,
          100% {
            background-position: 200% 0;
          }
          50% {
            background-position: -50% 0;
          }
        }
      `}</style>
    </div>
  );
}