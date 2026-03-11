import SliderSection from "@/components/sections/home/SliderSection";
import AnnouncementsSection from "@/components/sections/home/AnnouncementsSection";
import QuickAccessSection from "@/components/sections/home/QuickAccessSection";
import { getSliders } from "@/features/slider/queries";
import { getHomeAnnouncements } from "@/features/announcements/queries";
import { getQuickAccessItems } from "@/features/quick-access/queries";

export default async function HomePage() {
  const [sliders, announcements, quickAccesses] = await Promise.all([
    getSliders(),
    getHomeAnnouncements(),
    getQuickAccessItems(),
  ]);

  return (
    <main>
      <SliderSection sliders={sliders} />
      <AnnouncementsSection announcements={announcements} />
      <QuickAccessSection items={quickAccesses} />
    </main>
  );
}