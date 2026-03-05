// components/ui/GradientHero.tsx
import { ReactNode } from "react";

interface GradientHeroProps {
  children: ReactNode;
}

export function GradientHero({ children }: GradientHeroProps) {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, var(--teal-4) 0%, var(--teal-3) 50%, var(--teal-2) 100%)",
      }}
    >
      {/* Dekoratif arka plan daireleri */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/5" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-white/5" />
      <div className="pointer-events-none absolute right-1/4 top-1/2 h-32 w-32 rounded-full bg-white/5" />

      {/* İçeriğin yerleştiği sabit hizalı kapsayıcı */}
      <div className="relative mx-auto max-w-5xl px-6 pb-14 pt-10">
        {children}
      </div>
    </section>
  );
}