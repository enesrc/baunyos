"use client";

import { useState, useEffect, useRef } from "react";

interface StickyHeaderProps {
  topBar: React.ReactNode;
  logoBar: React.ReactNode;
  navBar: React.ReactNode;
}

export default function StickyHeader({ topBar, logoBar, navBar }: StickyHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const threshold = 10;

    const onScroll = () => {
      const shouldScroll = window.scrollY > threshold;
      setScrolled((prev) => (prev !== shouldScroll ? shouldScroll : prev));
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      {/* TopBar + LogoBar: yüksekliği gerçekten collapse edilir, layout kaymasını önler */}
      <div
        ref={topRef}
        style={{
          gridTemplateRows: scrolled ? "0fr" : "1fr",
          transition: "grid-template-rows 150ms ease",
        }}
        className="grid"
      >
        <div className="overflow-hidden">
          {topBar}
          {logoBar}
        </div>
      </div>

      {/* NavBar: her zaman görünür */}
      <div className={scrolled ? "shadow-md shadow-dark-4/10 dark:shadow-dark-4/30" : ""}>
        {navBar}
      </div>
    </header>
  );
}