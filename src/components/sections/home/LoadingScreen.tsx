'use client';

import { useEffect, useState } from 'react';

interface LoadingScreenProps {
    onFadeOutDone?: () => void;
    isReady: boolean;
}

export default function LoadingScreen({ isReady, onFadeOutDone }: LoadingScreenProps) {
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        if (!isReady) return;
        const t = setTimeout(() => setFadeOut(true), 500);
        return () => clearTimeout(t);
    }, [isReady]);

    useEffect(() => {
        if (!fadeOut) return;
        const t = setTimeout(() => onFadeOutDone?.(), 900);
        return () => clearTimeout(t);
    }, [fadeOut, onFadeOutDone]);

    return (
        <div
            className={`fixed inset-0 z-10000 flex flex-col items-center justify-center bg-[#040e1a] transition-opacity duration-900 ease-in-out ${fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
                }`}
        >
            {/* Arka plan glow */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        'radial-gradient(ellipse 600px 400px at 50% 45%, rgba(0,148,192,0.06) 0%, transparent 70%)',
                }}
            />

            {/* Logo container */}
            <div className="relative w-20 h-20 mb-10 animate-[lsBreathe_3s_ease-in-out_infinite]">
                {/* Glow halkası */}
                <div
                    className="absolute -inset-5 rounded-full animate-[lsGlow_3s_ease-in-out_infinite]"
                    style={{
                        background:
                            'radial-gradient(circle, rgba(0,148,192,0.12) 0%, rgba(0,148,192,0.04) 50%, transparent 70%)',
                    }}
                />

                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src="/logos/baun-logo.png"
                    alt="BAÜ"
                    className="relative w-full h-full object-contain drop-shadow-[0_0_20px_rgba(0,148,192,0.3)]"
                    onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                    }}
                />
            </div>

            {/* Loading text */}
            <p className="text-[0.65rem] tracking-[0.3em] uppercase text-[rgba(0,148,192,0.7)] font-normal mb-4">
                LOADING
            </p>

            {/* Progress bar */}
            <div className="w-25 h-px bg-[rgba(0,148,192,0.1)] rounded-sm overflow-hidden">
                <div className="w-[30%] h-full bg-[rgba(0,148,192,0.7)] rounded-sm animate-[lsSlide_1.6s_ease-in-out_infinite]" />
            </div>

            <style>{`
        @keyframes lsBreathe {
          0%, 100% { transform: scale(1); }
          50%      { transform: scale(1.04); }
        }
        @keyframes lsGlow {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50%      { opacity: 1;   transform: scale(1.1); }
        }
        @keyframes lsSlide {
          0%   { transform: translateX(-120%); }
          100% { transform: translateX(440%); }
        }
      `}</style>
        </div>
    );
}