"use client";

import { useState, useEffect, startTransition } from "react";
import { GlobeIntroOverlay } from "@/features/globe/GlobeIntroOverlay";

const INTRO_SEEN_KEY = "bau_intro_seen";

export default function SiteShell({
  children,
  header,
  footer,
  isHomePage,
}: {
  children: React.ReactNode;
  header: React.ReactNode;
  footer: React.ReactNode;
  isHomePage: boolean;
}) {
  const [introState, setIntroState] = useState<"pending" | "playing" | "done">("pending");

  useEffect(() => {
    startTransition(() => {
      if (!isHomePage) { setIntroState("done"); return; }
      const alreadySeen = sessionStorage.getItem(INTRO_SEEN_KEY) === "1";
      setIntroState(alreadySeen ? "done" : "playing");
    });
  }, [isHomePage]);

  const handleIntroComplete = () => {
    sessionStorage.setItem(INTRO_SEEN_KEY, "1");
    setIntroState("done");
  };

  const isHiding = introState !== "done";

  return (
    <>
      {introState === "playing" && <GlobeIntroOverlay onComplete={handleIntroComplete} />}
      <div
        style={{
          visibility: isHiding ? "hidden" : "visible",
          opacity: isHiding ? 0 : 1,
          transition: introState === "done" ? "opacity 0.6s ease" : "none",
        }}
      >
        {header}
        {children}
        {footer}
      </div>
    </>
  );
}