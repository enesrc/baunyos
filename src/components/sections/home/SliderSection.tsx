// components/sections/home/SliderSection.tsx
"use client";

import { useI18n } from "@/features/i18n/I18nContextValue";

export default function SliderSection() {
  const { dict } = useI18n();

  return (
    <section className="relative overflow-hidden">
      {/* TODO: Slider implement edilecek */}
      <div className="flex min-h-screen items-center justify-center">
        <p className="opacity-50">{dict.home.title}</p>
      </div>
    </section>
  );
}