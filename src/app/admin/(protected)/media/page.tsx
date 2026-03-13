import { getMediaItems } from "@/features/media/queries";
import MediaPanel from "@/components/sections/admin/MediaPanel";

export default async function MediaPage() {
  const media = await getMediaItems();

  return (
    <div>
      <h1 className="text-lg font-semibold text-gray-900 mb-4">Medya</h1>
      <MediaPanel initialMedia={media} />
    </div>
  );
}
