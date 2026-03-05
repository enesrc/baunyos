"use client";

import { useRef, useEffect, useState } from "react";

interface StickyHeaderProps {
  topBar: React.ReactNode;
  logoBar: React.ReactNode;
  navBar: React.ReactNode;
}

export default function StickyHeader({ topBar, logoBar, navBar }: StickyHeaderProps) {
  const topBarRef = useRef<HTMLDivElement>(null);
  const logoBarRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const measure = () => {
      const h =
        (topBarRef.current?.offsetHeight ?? 0) +
        (logoBarRef.current?.offsetHeight ?? 0);
      setOffset(h);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <header
      className="sticky z-50"
      style={{ top: -offset }}
    >
      <div ref={topBarRef}>{topBar}</div>
      <div ref={logoBarRef}>{logoBar}</div>
      <div>{navBar}</div>
    </header>
  );
}