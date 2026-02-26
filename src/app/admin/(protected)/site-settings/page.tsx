import { getSiteSettings } from "@/features/site-settings/queries";
import SiteSettingsForm from "@/components/sections/admin/SiteSettingsForm";

export default async function SiteSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold">Site Ayarları</h1>
      <SiteSettingsForm settings={settings} />
    </div>
  );
}