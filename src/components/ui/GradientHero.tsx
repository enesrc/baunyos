import { ReactNode } from "react";

export function GradientHero({ children }: { children: ReactNode }) {
  return (
    <section className="relative w-full overflow-hidden text-white">
      {/* Main gradient background */}
      <div className="absolute inset-0 bg-[linear-gradient(135deg,var(--cyan-deep)_0%,var(--cyan-dull)_38%,var(--cyan-dull)_62%,var(--cyan-deep)_100%)]" />

      {/* Left vignette */}
      <div className="absolute inset-y-0 left-0 w-[32%] bg-[linear-gradient(90deg,color-mix(in_srgb,var(--dark-7)_16%,transparent)_0%,transparent_100%)]" />

      {/* Right vignette */}
      <div className="absolute inset-y-0 right-0 w-[32%] bg-[linear-gradient(270deg,color-mix(in_srgb,var(--dark-7)_16%,transparent)_0%,transparent_100%)]" />

      {/* Bottom depth */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,transparent_0%,color-mix(in_srgb,var(--dark-7)_16%,transparent)_100%)]" />

      <div className="relative z-10 mx-auto max-w-5xl px-6 pt-10 pb-16">
        <div className="flex flex-col">
          {children}
        </div>
      </div>
    </section>
  );
}