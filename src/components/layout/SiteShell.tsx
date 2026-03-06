"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation"; // Dinamik sayfa kontrolü için
import { GlobeIntroOverlay } from "@/features/globe/GlobeIntroOverlay";

const INTRO_SEEN_KEY = "baun_intro_seen";

export default function SiteShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const [done, setDone] = useState(false);
  const pathname = usePathname();

  // Mevcut sayfanın gerçekten ana sayfa olup olmadığını kontrol et
  // Örn: "/tr", "/en" veya sadece "/" ana sayfadır.
  let isActualHomePage = pathname === "/" || pathname === "/tr" || pathname === "/en";
  isActualHomePage = false;
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setMounted(true);

      const alreadySeen = sessionStorage.getItem(INTRO_SEEN_KEY) === "1";

      // Eğer ana sayfada değilsek veya intro izlendiyse direkt bitir
      if (!isActualHomePage || alreadySeen) {
        setDone(true);
      }
    });

    return () => cancelAnimationFrame(frame);
  }, [isActualHomePage]);

  const handleIntroComplete = () => {
    sessionStorage.setItem(INTRO_SEEN_KEY, "1");
    setDone(true);
  };

  // Intro gösterilmeli mi?
  const showIntro = mounted && isActualHomePage && !done;

  return (
    <>
      {showIntro && <GlobeIntroOverlay onComplete={handleIntroComplete} />}

      {/* İçerik her zaman DOM'da durur (SEO dostu), 
          sadece görünürlüğü 'done' durumuna bağlıdır.
      */}
      <div
        className={`
          transition-opacity duration-1000 ease-in-out
          ${!done ? "opacity-0 invisible" : "opacity-100 visible"}
        `}
      >
        {children}
      </div>
    </>
  );
}