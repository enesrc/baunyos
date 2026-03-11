import Link from "next/link";
import { ArrowRightIcon } from "@phosphor-icons/react/ssr";
import { translate } from "@/features/Language/translate";

export default function ViewAll({ href, lang }: { href: string; lang: "tr" | "en" }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-2 text-lg font-semibold text-cyan-dull transition-colors hover:text-cyan dark:text-cyan-bright dark:hover:text-cyan"
    >
      {translate(lang, "View all", "Tümünü gör")}
      <ArrowRightIcon size={18} className="transition-transform group-hover:translate-x-1 block" />
    </Link>
  );
}