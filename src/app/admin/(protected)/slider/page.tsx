import Link from "next/link";
import Image from "next/image";
import { getSliders } from "@/features/slider/queries";
import { deleteSlider } from "@/features/slider/actions";

export default async function SliderPage() {
  const sliders = await getSliders();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Slider</h1>
        <Link
          href="/admin/slider/new"
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white"
        >
          Yeni Slide
        </Link>
      </div>

      <div className="rounded-xl border border-border">
        {sliders.length === 0 && (
          <p className="p-6 text-sm opacity-50">Henüz slide yok.</p>
        )}
        {sliders.map((slider, i) => (
          <div
            key={slider.id}
            className={`flex items-center justify-between px-6 py-4 ${
              i !== sliders.length - 1 ? "border-b border-border" : ""
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-28 overflow-hidden rounded-lg">
                <Image
                  src={slider.image_url}
                  alt={slider.title_tr}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-medium">{slider.title_tr}</p>
                <p className="text-xs opacity-50">
                  sıra: {slider.order} •{" "}
                  {slider.is_active ? "Aktif" : "Pasif"}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link
                href={`/admin/slider/${slider.id}`}
                className="text-sm opacity-70 hover:opacity-100"
              >
                Düzenle
              </Link>
              <form
                action={async () => {
                  "use server";
                  await deleteSlider(slider.id);
                }}
              >
                <button
                  type="submit"
                  className="text-sm text-red-500 opacity-70 hover:opacity-100"
                >
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