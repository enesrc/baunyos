// components/ui/GradientHero.tsx
import { ReactNode } from "react";

interface GradientHeroProps {
  children: ReactNode;
}

export function GradientHero({ children }: GradientHeroProps) {
  return (
    <section className="relative overflow-hidden bg-teal-3 dark:bg-dark-3">



      {/* Alt kenar ince çizgi */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-white/10 dark:bg-teal-3/20" />

      {/* İçerik */}
      <div className="relative mx-auto max-w-5xl px-6 pb-14 pt-10 text-white">
        {children}
      </div>
    </section>
  );
}