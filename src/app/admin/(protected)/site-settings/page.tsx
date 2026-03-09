import { getSiteSettings } from "@/features/site-settings/queries";
import SiteSettingsForm from "@/components/sections/admin/SiteSettingsForm";

export default async function SiteSettingsPage() {
  const settings = await getSiteSettings();

  return <SiteSettingsForm settings={settings} />;
}