// app/[locale]/page.tsx
import SliderSection from "@/components/sections/home/SliderSection";
import AnnouncementsSection from "@/components/sections/home/AnnouncementsSection";
import QuickAccessSection from "@/components/sections/home/QuickAccessSection";
import { getSliders } from "@/features/slider/queries";
import { getHomeAnnouncements } from "@/features/announcements/queries";

export default async function HomePage() {
  const [sliders, announcements] = await Promise.all([
    getSliders(),
    getHomeAnnouncements(),
  ]);

  return (
    <main>
      <SliderSection sliders={sliders} />
      <AnnouncementsSection announcements={announcements} />
      <QuickAccessSection />
    </main>
  );
}