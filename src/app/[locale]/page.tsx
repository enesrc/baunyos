// app/[locale]/page.tsx
import SliderSection from '@/components/sections/home/SliderSection';
import QuickAccessSection from '@/components/sections/home/QuickAccessSection';
import ContentHighlightsSection from '@/components/sections/home/ContentHighlightsSection';

export default function HomePage() {
  return (
    <main>
      <SliderSection />
      <QuickAccessSection />
      <ContentHighlightsSection />
    </main>
  );
}