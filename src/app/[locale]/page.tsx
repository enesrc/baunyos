// app/[locale]/page.tsx
import SliderSection from '@/components/sections/home/SliderSection';
import { getSliders } from "@/features/slider/queries";
import QuickAccessSection from '@/components/sections/home/QuickAccessSection';

export default async function HomePage() {
  const sliders = await getSliders();

  return (
    <main>
      <SliderSection sliders={sliders}/>
      <QuickAccessSection />
    </main>
  );
}