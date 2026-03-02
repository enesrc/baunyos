import Link from "next/link";
import Image from "next/image";
import { getSliders } from "@/features/slider/queries";
import { deleteSlider } from "@/features/slider/actions";

export default async function SliderPage() {
  const sliders = await getSliders();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-dark-3 dark:text-light-1">Slider</h1>
        <Link
          href="/admin/slider/new"
          className="rounded-md bg-teal-3 px-4 py-2 text-sm font-semibold text-light-1 transition-colors hover:bg-teal-4 dark:bg-teal-2 dark:hover:bg-teal-3"
        >
          Yeni Slide
        </Link>
      </div>

      <div className="rounded-md border border-light-4 bg-light-1 dark:border-dark-1 dark:bg-dark-3">
        {sliders.length === 0 && (
          <p className="p-6 text-sm text-gray-3 dark:text-gray-2">Henüz slide yok.</p>
        )}
        {sliders.map((slider, i) => (
          <div
            key={slider.id}
            className={`flex items-center justify-between px-6 py-4 ${
              i !== sliders.length - 1 ? "border-b border-light-4 dark:border-dark-1" : ""
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-28 overflow-hidden rounded-md">
                <Image src={slider.image_url} alt={slider.title_tr} fill className="object-cover" />
              </div>
              <div>
                <p className="text-sm font-medium text-dark-3 dark:text-light-1">{slider.title_tr}</p>
                <p className="text-xs text-gray-3 dark:text-gray-2">
                  sıra: {slider.order} •{" "}
                  <span className={slider.is_active ? "text-green-3 dark:text-green-2" : "text-gray-3"}>
                    {slider.is_active ? "Aktif" : "Pasif"}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link
                href={`/admin/slider/${slider.id}`}
                className="text-sm text-teal-3 transition-colors hover:text-teal-4 dark:text-teal-2 dark:hover:text-teal-1"
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
                  className="text-sm text-red-3 transition-colors hover:text-red-4 dark:text-red-2 dark:hover:text-red-3"
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