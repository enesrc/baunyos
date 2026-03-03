'use client';

import { useEffect, useRef, MutableRefObject } from 'react';
import dynamic from 'next/dynamic';
import * as THREE from 'three';

const Globe = dynamic(() => import('react-globe.gl'), { ssr: false });

const BAU_LAT = 39.6484;
const BAU_LNG = 27.8826;
const IDLE_SPD = 0.08;

const EARTH_IMG_URL = '/globe/map.jpg';
const BUMP_IMG_URL = '/globe/topology.png';
const CLOUDS_IMG_URL = '/globe/cloud.png';

const CLOUDS_ALT = 0.004;
const CLOUDS_ROTATION_SPEED = -0.006; // deg/frame

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const normLng = (lng: number) => ((lng % 360) + 540) % 360 - 180;

function buildKeyframes(fromLat: number, fromLng: number, fromAlt: number) {
  const nLng = normLng(fromLng);
  const diff = BAU_LNG - nLng;
  const mLng =
    nLng +
    (Math.abs(diff) > 180
      ? (diff > 0 ? diff - 360 : diff + 360) / 2
      : diff / 2);
  const mLat = (fromLat + BAU_LAT) / 2;

  return [
    { p: 0.0, lat: fromLat, lng: nLng, alt: fromAlt },
    { p: 0.3, lat: mLat, lng: mLng, alt: Math.max(fromAlt, 1.8) },
    { p: 0.6, lat: 38.0, lng: BAU_LNG, alt: 1.0 },
    { p: 0.8, lat: BAU_LAT, lng: BAU_LNG, alt: 0.35 },
    { p: 1.0, lat: BAU_LAT, lng: BAU_LNG, alt: 0.018 },
  ];
}

type KF = ReturnType<typeof buildKeyframes>;

function getCam(raw: number, kf: KF) {
  const p = ease(Math.max(0, Math.min(1, raw)));
  let s = kf[0];
  let e = kf[kf.length - 1];

  for (let i = 0; i < kf.length - 1; i++) {
    if (p >= kf[i].p && p <= kf[i + 1].p) {
      s = kf[i];
      e = kf[i + 1];
      break;
    }
  }

  const t = (p - s.p) / (e.p - s.p || 1);

  return {
    lat: lerp(s.lat, e.lat, t),
    lng: lerp(s.lng, e.lng, t),
    altitude: lerp(s.alt, e.alt, t),
  };
}

export interface GlobePosition {
  lat: number;
  lng: number;
  alt: number;
}

interface Props {
  progress: number;
  isAnimating: boolean;
  startLat: number;
  startLng: number;
  startAlt: number;
  width: number;
  height: number;
  positionRef: MutableRefObject<GlobePosition>;
  onGlobeReady?: () => void;  // ← yeni
}

export function GlobeIntroScene({
  progress,
  isAnimating,
  startLat,
  startLng,
  startAlt,
  width,
  height,
  positionRef,
  onGlobeReady,  // ← yeni
}: Props) {
  // react-globe.gl instance type'ı burada geniş tutuluyor
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globeRef = useRef<any>(null);
  const rafRef = useRef<number>(0);
  const cloudsRafRef = useRef<number>(0);
  const idleLngRef = useRef(startLng);
  const isAnimRef = useRef(false);
  const keyframesRef = useRef(buildKeyframes(startLat, startLng, startAlt));
  const cloudsRef = useRef<THREE.Mesh | null>(null);
  const cloudsTextureRef = useRef<THREE.Texture | null>(null);
  const readyFiredRef = useRef(false);

  useEffect(() => {
    isAnimRef.current = isAnimating;
    if (isAnimating) {
      keyframesRef.current = buildKeyframes(startLat, startLng, startAlt);
    }
  }, [isAnimating, startLat, startLng, startAlt]);

  useEffect(() => {
    const tick = () => {
      if (!isAnimRef.current && globeRef.current) {
        idleLngRef.current += IDLE_SPD;

        const pos = {
          lat: 15.0,
          lng: idleLngRef.current,
          altitude: 2.5,
        };

        globeRef.current.pointOfView(pos, 0);
        positionRef.current = {
          lat: 15.0,
          lng: idleLngRef.current,
          alt: 2.5,
        };
      }

      rafRef.current = window.requestAnimationFrame(tick);
    };

    rafRef.current = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(rafRef.current);
    };
  }, [positionRef]);

  useEffect(() => {
    if (!isAnimating || !globeRef.current) return;
    globeRef.current.pointOfView(getCam(progress, keyframesRef.current), 0);
  }, [progress, isAnimating]);

  const onReady = () => {
    if (!globeRef.current) return;

    globeRef.current.pointOfView(
      { lat: 15.0, lng: startLng, altitude: 2.5 },
      0
    );

    const controls = globeRef.current.controls?.();
    if (controls) {
      controls.enabled = false;
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.autoRotate = false;
    }

    if (!cloudsRef.current) {
      const globeRadius = globeRef.current.getGlobeRadius();
      const textureLoader = new THREE.TextureLoader();
      const cloudsTexture = textureLoader.load(CLOUDS_IMG_URL);

      cloudsTextureRef.current = cloudsTexture;

      const clouds = new THREE.Mesh(
        new THREE.SphereGeometry(globeRadius * (1 + CLOUDS_ALT), 75, 75),
        new THREE.MeshPhongMaterial({
          map: cloudsTexture,
          transparent: true,
          opacity: 0.95,
          depthWrite: false,
          side: THREE.DoubleSide,
        })
      );

      cloudsRef.current = clouds;
      globeRef.current.scene().add(clouds);

      const rotateClouds = () => {
        if (cloudsRef.current) {
          cloudsRef.current.rotation.y +=
            (CLOUDS_ROTATION_SPEED * Math.PI) / 180;
        }
        cloudsRafRef.current = window.requestAnimationFrame(rotateClouds);
      };
      cloudsRafRef.current = window.requestAnimationFrame(rotateClouds);
    }

    // ★ Globe hazır sinyali — sadece bir kez
    if (!readyFiredRef.current) {
      readyFiredRef.current = true;
      onGlobeReady?.();
    }
  };

  useEffect(() => {
    const globeInstance = globeRef.current;

    return () => {
      window.cancelAnimationFrame(cloudsRafRef.current);

      if (globeInstance && cloudsRef.current) {
        globeInstance.scene().remove(cloudsRef.current);
      }

      if (cloudsRef.current) {
        cloudsRef.current.geometry.dispose();

        const material = cloudsRef.current.material;
        if (Array.isArray(material)) {
          material.forEach((m) => m.dispose());
        } else {
          material.dispose();
        }

        cloudsRef.current = null;
      }

      if (cloudsTextureRef.current) {
        cloudsTextureRef.current.dispose();
        cloudsTextureRef.current = null;
      }
    };
  }, []);

  const gW = Math.round(width * 1.45);
  const gH = Math.round(height * 1.45);

  return (
    <div style={{ width: gW, height: gH, pointerEvents: 'none' }}>
      <Globe
        ref={globeRef}
        onGlobeReady={onReady}
        animateIn={false}
        width={gW}
        height={gH}
        backgroundColor="rgba(0,0,0,0)"
        globeImageUrl={EARTH_IMG_URL}
        bumpImageUrl={BUMP_IMG_URL}
        pointsData={[{ lat: BAU_LAT, lng: BAU_LNG }]}
        pointColor={() => 'rgba(255,255,255,0.95)'}
        pointAltitude={0.01}
        pointRadius={0.02}
        enablePointerInteraction={false}
      />
    </div>
  );
}