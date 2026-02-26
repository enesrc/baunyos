"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Globe from "react-globe.gl";
import type { GlobeMethods } from "react-globe.gl";
import type { Arc, Pin } from "./arcs";
import { ARCS, PINS } from "./arcs";
import { BALIKESIR } from "./camera";

type Props = { progress: number };

function clamp01(t: number) {
  return Math.max(0, Math.min(1, t));
}

export default function GlobeScene({ progress }: Props) {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const [size, setSize] = useState({ w: 0, h: 0 });

  const arcs = useMemo<Arc[]>(() => ARCS, []);
  const pins = useMemo<Pin[]>(() => PINS, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      setSize({
        w: Math.max(0, Math.round(r.width)),
        h: Math.max(0, Math.round(r.height)),
      });
    });

    ro.observe(el);

    const r = el.getBoundingClientRect();
    setSize({
      w: Math.max(0, Math.round(r.width)),
      h: Math.max(0, Math.round(r.height)),
    });

    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const g = globeRef.current;
    if (!g) return;

    // Başlangıçta dünya modelini büyük göstermek için
    g.pointOfView({ lat: 20, lng: 10, altitude: 3.0 }, 0);  // initial zoom level

    const controls = g.controls();
    controls.enablePan = false;
    controls.enableZoom = false; // page scroll bozulmasın
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.rotateSpeed = 0.35;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.25;
  }, []);

  useEffect(() => {
    const g = globeRef.current;
    if (!g) return;

    const t = clamp01(progress);  // progress değeri ile scroll etkileşimini alıyoruz
    const altitude = 3.0 - t * 1.5;  // scroll ile zoom seviyesini küçültme
    const lat = (1 - t) * 18 + t * BALIKESIR.lat;  // başlangıçtan Balıkesir'e odaklanma
    const lng = (1 - t) * 10 + t * BALIKESIR.lng;

    g.pointOfView({ lat, lng, altitude }, 0);
  }, [progress]);

  return (
    <div
      ref={wrapRef}
      className="relative h-105 w-full overflow-hidden rounded-2xl border border-white/10 bg-glass/60 shadow-soft backdrop-blur-xl md:h-130"
    >
      {size.w > 0 && size.h > 0 && (
        <Globe
          ref={globeRef}
          width={size.w}
          height={size.h}
          rendererConfig={{ antialias: true, alpha: true }}  // alpha: true, canvas'ı şeffaf yapar
          backgroundColor="rgba(0,0,0,0)"  // Arka plan rengini şeffaf yapıyoruz
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          showAtmosphere
          atmosphereAltitude={0.18}
          arcsData={arcs}
          arcStartLat={(d: object) => (d as Arc).startLat}
          arcStartLng={(d: object) => (d as Arc).startLng}
          arcEndLat={(d: object) => (d as Arc).endLat}
          arcEndLng={(d: object) => (d as Arc).endLng}
          arcColor={() => ["rgba(80,140,255,0.10)", "rgba(80,140,255,0.85)"]}
          arcAltitude={0.25}
          arcStroke={0.55}
          arcDashLength={0.55}
          arcDashGap={2.5}
          arcDashAnimateTime={1800}
          pointsData={pins}
          pointLat={(d: object) => (d as Pin).lat}
          pointLng={(d: object) => (d as Pin).lng}
          pointColor={() => "rgba(80,140,255,0.95)"}
          pointAltitude={0.02}
          pointRadius={0.45}
        />
      )}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-tr from-black/25 via-transparent to-black/15" />
    </div>
  );
}