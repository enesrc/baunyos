import Link from "next/link";
import Image from "next/image";
import { getSliders } from "@/features/slider/queries";
import { deleteSlider } from "@/features/slider/actions";

export default async function SliderPage() {
  const sliders = await getSliders();

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Link href="/admin/slider/new" className="bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700 transition-colors">
          Yeni Slide
        </Link>
      </div>

      <div className="border border-gray-200">
        {sliders.length === 0 && (
          <p className="p-4 text-sm text-gray-400">Henüz slide yok.</p>
        )}
        {sliders.map((slider, i) => (
          <div key={slider.id} className={`flex items-center justify-between px-4 py-3 ${i !== sliders.length - 1 ? "border-b border-gray-200" : ""}`}>
            <div className="flex items-center gap-4">
              <div className="relative h-14 w-24 overflow-hidden">
                <Image src={slider.image_url} alt={slider.title_tr} fill className="object-cover" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{slider.title_tr}</p>
                <p className="text-xs text-gray-400">
                  sıra: {slider.order} ·{" "}
                  <span className={slider.is_active ? "text-green-600" : "text-gray-400"}>
                    {slider.is_active ? "Aktif" : "Pasif"}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href={`/admin/slider/${slider.id}`} className="bg-yellow-400 px-3 py-1.5 text-sm text-white hover:bg-yellow-500 transition-colors">
                Düzenle
              </Link>
              <form action={async () => { "use server"; await deleteSlider(slider.id); }}>
                <button type="submit" className="bg-red-500 px-3 py-1.5 text-sm text-white hover:bg-red-600 transition-colors">
                  Sil
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}