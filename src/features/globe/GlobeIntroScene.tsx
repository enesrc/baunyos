'use client';

import { useEffect, useRef, MutableRefObject } from 'react';
import dynamic from 'next/dynamic';
import * as THREE from 'three';

const Globe = dynamic(() => import('react-globe.gl'), { ssr: false });

const BAU_LAT = 39.6484;
const BAU_LNG = 27.8826;

const EARTH_IMG = '/globe/map.jpg';
const BUMP_IMG = '/globe/topology.png';
const CLOUDS_IMG = '/globe/cloud.png';

const IDLE_SPD = 0.08;
const IDLE_LAT = 15.0;
const IDLE_ALT = 2.5;
const SCALE = 1.45;

const CLOUDS_ALT = 0.004;
const CLOUDS_ROT = -0.006;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const normLng = (lng: number) => ((lng % 360) + 540) % 360 - 180;
const ease = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

function buildKeyframes(lat: number, lng: number, alt: number) {
  const nLng = normLng(lng);
  const diff = BAU_LNG - nLng;
  const mLng = nLng + (Math.abs(diff) > 180
    ? (diff > 0 ? diff - 360 : diff + 360) / 2
    : diff / 2);

  return [
    { p: 0.0, lat, lng: nLng, alt },
    { p: 0.3, lat: (lat + BAU_LAT) / 2, lng: mLng, alt: Math.max(alt, 1.8) },
    { p: 0.6, lat: 38.0, lng: BAU_LNG, alt: 1.0 },
    { p: 0.8, lat: BAU_LAT, lng: BAU_LNG, alt: 0.35 },
    { p: 1.0, lat: BAU_LAT, lng: BAU_LNG, alt: 0.018 },
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

export interface GlobePosition { lat: number; lng: number; alt: number }

interface Props {
  progress: number;
  isAnimating: boolean;
  startLat: number;
  startLng: number;
  startAlt: number;
  width: number;
  height: number;
  positionRef: MutableRefObject<GlobePosition>;
  onGlobeReady?: () => void;
}

export function GlobeIntroScene({
  progress, isAnimating,
  startLat, startLng, startAlt,
  width, height,
  positionRef, onGlobeReady,
}: Props) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globeRef = useRef<any>(null);
  const rafRef = useRef(0);
  const cloudsRafRef = useRef(0);
  const idleLngRef = useRef(startLng);
  const isAnimRef = useRef(false);
  const keyframesRef = useRef(buildKeyframes(startLat, startLng, startAlt));
  const cloudsRef = useRef<THREE.Mesh | null>(null);
  const cloudsTextureRef = useRef<THREE.Texture | null>(null);
  const readyFiredRef = useRef(false);
  const setupDoneRef = useRef(false);

  // onGlobeReady callback'ini ref ile güncel tut (stale closure önlemi)
  const onGlobeReadyRef = useRef(onGlobeReady);
  useEffect(() => { onGlobeReadyRef.current = onGlobeReady; }, [onGlobeReady]);

  // Animasyon flag senkronizasyonu
  useEffect(() => {
    isAnimRef.current = isAnimating;
    if (isAnimating) keyframesRef.current = buildKeyframes(startLat, startLng, startAlt);
  }, [isAnimating, startLat, startLng, startAlt]);

  /**
   * Globe instance hazır olduğunda kontrolleri kapat ve bulutları kur.
   * onReady'den veya idle tick'ten çağrılabilir — setupDoneRef ile tek seferlik.
   */
  const initGlobe = () => {
    const g = globeRef.current;
    if (!g || setupDoneRef.current) return;
    setupDoneRef.current = true;

    g.pointOfView({ lat: IDLE_LAT, lng: startLng, altitude: IDLE_ALT }, 0);

    const ctrl = g.controls?.();
    if (ctrl) { ctrl.enabled = false; ctrl.enableZoom = false; ctrl.enablePan = false; ctrl.autoRotate = false; }

    // Bulut katmanı
    if (!cloudsRef.current) {
      try {
        const r = g.getGlobeRadius();
        const tex = new THREE.TextureLoader().load(CLOUDS_IMG);
        cloudsTextureRef.current = tex;

        const mesh = new THREE.Mesh(
          new THREE.SphereGeometry(r * (1 + CLOUDS_ALT), 75, 75),
          new THREE.MeshPhongMaterial({
            map: tex, transparent: true, opacity: 0.95,
            depthWrite: false, side: THREE.DoubleSide,
          }),
        );
        cloudsRef.current = mesh;
        g.scene().add(mesh);

        const spin = () => {
          if (cloudsRef.current) cloudsRef.current.rotation.y += (CLOUDS_ROT * Math.PI) / 180;
          cloudsRafRef.current = requestAnimationFrame(spin);
        };
        cloudsRafRef.current = requestAnimationFrame(spin);
      } catch { /* cloud setup başarısız — devam et */ }
    }
  };

  /** Ready sinyalini bir kez gönder */
  const fireReady = () => {
    if (readyFiredRef.current) return;
    readyFiredRef.current = true;
    onGlobeReadyRef.current?.();
  };

  // Idle rotation — aynı zamanda globeRef null gelme sorununa fallback
  useEffect(() => {
    const tick = () => {
      if (!isAnimRef.current && globeRef.current) {
        // Globe ref artık hazır — setup yapılmadıysa yap, sinyal gönderilmediyse gönder
        if (!setupDoneRef.current) initGlobe();
        //if (!readyFiredRef.current) fireReady();

        idleLngRef.current += IDLE_SPD;
        globeRef.current.pointOfView({ lat: IDLE_LAT, lng: idleLngRef.current, altitude: IDLE_ALT }, 0);
        positionRef.current = { lat: IDLE_LAT, lng: idleLngRef.current, alt: IDLE_ALT };
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [positionRef]);

  // Animasyon kamera takibi
  useEffect(() => {
    if (isAnimating && globeRef.current)
      globeRef.current.pointOfView(getCam(progress, keyframesRef.current), 0);
  }, [progress, isAnimating]);

  // react-globe.gl onGlobeReady callback'i
  const onReady = () => {
    const g = globeRef.current;
    if (!g) {
      // Globe ref henüz atanmamış — kısa gecikme ile tekrar dene
      setTimeout(onReady, 50);
      return;
    }
    initGlobe();
    fireReady(); 
  };

  // Cleanup
  useEffect(() => {
    const inst = globeRef.current;
    return () => {
      cancelAnimationFrame(cloudsRafRef.current);
      if (inst && cloudsRef.current) {
        try { inst.scene().remove(cloudsRef.current); } catch { /* unmount race */ }
      }
      if (cloudsRef.current) {
        cloudsRef.current.geometry.dispose();
        const m = cloudsRef.current.material;
        (Array.isArray(m) ? m : [m]).forEach((x) => x.dispose());
        cloudsRef.current = null;
      }
      if (cloudsTextureRef.current) {
        cloudsTextureRef.current.dispose();
        cloudsTextureRef.current = null;
      }
    };
  }, []);

  const gW = Math.round(width * SCALE);
  const gH = Math.round(height * SCALE);

  return (
    <div style={{ width: gW, height: gH, pointerEvents: 'none' }}>
      <Globe
        ref={globeRef}
        onGlobeReady={onReady}
        animateIn={false}
        width={gW}
        height={gH}
        backgroundColor="rgba(0,0,0,0)"
        globeImageUrl={EARTH_IMG}
        bumpImageUrl={BUMP_IMG}
        atmosphereColor="#0094c0"
        atmosphereAltitude={0.18}
        pointsData={[{ lat: BAU_LAT, lng: BAU_LNG }]}
        pointColor={() => 'rgba(0,200,220,0.95)'}
        pointAltitude={0.01}
        pointRadius={0.02}
        enablePointerInteraction={false}
      />
    </div>
  );
}