import SliderForm from "@/components/sections/admin/SliderForm";
import { getSliderById } from "@/features/slider/queries";
import { notFound } from "next/navigation";

export default async function EditSliderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const slider = await getSliderById(Number(id));

  if (!slider) notFound();

  return (
    <div>
<h1 className="mb-6 text-xl font-semibold text-dark-3 dark:text-light-1">Slide Düzenle</h1>
      <SliderForm slider={slider} />
    </div>
  );
}