"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

type Props = {
  src: string;
  alt?: string;
  className?: string;
};

const MAX_SIZE = 500;

export default function ImageViewer({ src, alt = "", className = "" }: Props) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);

  const close = useCallback(() => setLightboxOpen(false), []);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightboxOpen, close]);

  const getScaledDimensions = () => {
    if (!dimensions) return { width: MAX_SIZE, height: MAX_SIZE };
    const { width, height } = dimensions;
    const ratio = Math.min(MAX_SIZE / width, MAX_SIZE / height, 1);
    return {
      width: Math.round(width * ratio),
      height: Math.round(height * ratio),
    };
  };

  const scaled = getScaledDimensions();

  return (
    <>
      {/* Thumbnail */}
      <div
        className={`group relative cursor-zoom-in overflow-hidden rounded-lg ${className}`}
        style={{ width: scaled.width, height: scaled.height }}
        onClick={() => setLightboxOpen(true)}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          onLoad={(e) => {
            const img = e.currentTarget;
            setDimensions({
              width: img.naturalWidth,
              height: img.naturalHeight,
            });
          }}
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-200 group-hover:bg-black/30">
          <div className="flex h-10 w-10 scale-75 items-center justify-center rounded-full bg-white/90 opacity-0 shadow-lg backdrop-blur-sm transition-all duration-200 group-hover:scale-100 group-hover:opacity-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-800"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
              <line x1="11" y1="8" x2="11" y2="14" />
              <line x1="8" y1="11" x2="14" y2="11" />
            </svg>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed left-0 top-0 z-50 flex items-center justify-center backdrop-blur-sm"
          style={{
            width: "100dvw",
            height: "100dvh",
            backgroundColor: "rgba(0, 0, 0, 0.75)",
          }}
          onClick={close}
        >
          {/* Butonlar */}
          <div className="absolute right-4 top-4 z-10 flex items-center gap-2">
            <a
              href={src}
              download
              onClick={(e) => e.stopPropagation()}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
              title="İndir"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </a>

            <button
              onClick={close}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
              title="Kapat"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Görsel */}
          <div
            className="relative overflow-hidden"
            style={{ width: "100dvw", height: "100dvh" }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={src}
              alt={alt}
              fill
              className="object-contain p-16"
              sizes="100dvw"
            />
          </div>
        </div>
      )}
    </>
  );
}