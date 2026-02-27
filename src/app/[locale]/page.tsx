// app/[locale]/page.tsx
import SliderSection from '@/components/sections/home/SliderSection';
import QuickAccessSection from '@/components/sections/home/QuickAccessSection';

export default function HomePage() {
  return (
    <main>
      <SliderSection />
      <QuickAccessSection />
    </main>
  );
}