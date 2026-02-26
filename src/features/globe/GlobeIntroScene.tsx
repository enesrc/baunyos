'use client';

import { useEffect, useRef, MutableRefObject } from 'react';
import dynamic from 'next/dynamic';

const Globe = dynamic(() => import('react-globe.gl'), { ssr: false });

const BAU_LAT  = 39.6484;
const BAU_LNG  = 27.8826;
const IDLE_SPD = 0.08;

const lerp    = (a: number, b: number, t: number) => a + (b - a) * t;
const ease    = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const normLng = (lng: number) => ((lng % 360) + 540) % 360 - 180;

function buildKeyframes(fromLat: number, fromLng: number, fromAlt: number) {
  const nLng = normLng(fromLng);
  const diff = BAU_LNG - nLng;
  const mLng = nLng + (Math.abs(diff) > 180
    ? (diff > 0 ? diff - 360 : diff + 360) / 2
    : diff / 2);
  const mLat = (fromLat + BAU_LAT) / 2;
  return [
    { p: 0.00, lat: fromLat, lng: nLng,    alt: fromAlt                },
    { p: 0.30, lat: mLat,    lng: mLng,    alt: Math.max(fromAlt, 1.8) },
    { p: 0.60, lat: 38.0,    lng: BAU_LNG, alt: 1.0                    },
    { p: 0.80, lat: BAU_LAT, lng: BAU_LNG, alt: 0.35                   },
    { p: 1.00, lat: BAU_LAT, lng: BAU_LNG, alt: 0.018                  },
  ];
}

type KF = ReturnType<typeof buildKeyframes>;

function getCam(raw: number, kf: KF) {
  const p = ease(Math.max(0, Math.min(1, raw)));
  let s = kf[0], e = kf[kf.length - 1];
  for (let i = 0; i < kf.length - 1; i++) {
    if (p >= kf[i].p && p <= kf[i + 1].p) { s = kf[i]; e = kf[i + 1]; break; }
  }
  const t = (p - s.p) / (e.p - s.p || 1);
  return { lat: lerp(s.lat, e.lat, t), lng: lerp(s.lng, e.lng, t), altitude: lerp(s.alt, e.alt, t) };
}

export interface GlobePosition { lat: number; lng: number; alt: number; }

interface Props {
  progress:    number;
  isAnimating: boolean;
  startLat:    number;
  startLng:    number;
  startAlt:    number;
  width:       number;
  height:      number;
  // Overlay bu ref'i geçirir — Scene her idle frame'de buraya yazar
  positionRef: MutableRefObject<GlobePosition>;
}

export function GlobeIntroScene({
  progress, isAnimating,
  startLat, startLng, startAlt,
  width, height,
  positionRef,
}: Props) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globeRef     = useRef<any>(null);
  const rafRef       = useRef<number>(0);
  const idleLngRef   = useRef(startLng);
  const isAnimRef    = useRef(false);
  const keyframesRef = useRef(buildKeyframes(startLat, startLng, startAlt));

  // isAnimating değişince ref'i hemen güncelle, keyframe'leri yakala
  useEffect(() => {
    isAnimRef.current = isAnimating;
    if (isAnimating) {
      keyframesRef.current = buildKeyframes(startLat, startLng, startAlt);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAnimating]);

  // Idle rotation — isAnimRef true olunca aynı frame'de durur
  useEffect(() => {
    const tick = () => {
      if (isAnimRef.current) return; // animasyon başladı, dur
      if (!globeRef.current) { rafRef.current = requestAnimationFrame(tick); return; }

      idleLngRef.current += IDLE_SPD;

      const pos = { lat: 15.0, lng: idleLngRef.current, altitude: 2.5 };
      globeRef.current.pointOfView(pos, 0);

      // Overlay'in okuyacağı güncel pozisyonu yaz
      positionRef.current = { lat: 15.0, lng: idleLngRef.current, alt: 2.5 };

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Progress → camera (animasyon sırasında)
  useEffect(() => {
    if (!isAnimating || !globeRef.current) return;
    globeRef.current.pointOfView(getCam(progress, keyframesRef.current), 0);
  }, [progress, isAnimating]);

  const onReady = () => {
    if (!globeRef.current) return;
    globeRef.current.pointOfView({ lat: 15.0, lng: startLng, altitude: 2.5 }, 0);
  };

  const gW = Math.round(width  * 1.45);
  const gH = Math.round(height * 1.45);

  return (
    <div style={{ width: gW, height: gH }}>
      <Globe
        ref={globeRef}
        onGlobeReady={onReady}
        width={gW}
        height={gH}
        backgroundColor="rgba(0,0,0,0)"
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-day.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        atmosphereColor="#4da6ff"
        atmosphereAltitude={0.22}
        pointsData={[{ lat: BAU_LAT, lng: BAU_LNG }]}
        pointColor={() => '#ffffff'}
        pointAltitude={0.0}
        pointRadius={0.4}
        enablePointerInteraction={false}
      />
    </div>
  );
}