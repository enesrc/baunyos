import Image from "next/image";
import Link from "next/link";
import { localePath } from "@/lib/links";
import { getDictionary } from "@/features/i18n/getDictionary";
import UniversityName from "@/components/ui/UniversityName";
import type { Locale } from "@/features/i18n/config";

interface LogoBarProps {
  locale: Locale;
  logoText: string;
}

export default async function LogoBar({ locale, logoText }: LogoBarProps) {
  const dict = await getDictionary(locale);
  const universityName = dict.common.universityName;
  const words = universityName.split(" ");
  const line1 = words[0];
  const line2 = words.slice(1).join(" ");

  return (
    <div className="border-b border-light-4 bg-light-1 dark:border-dark-1 dark:bg-dark-3">
      <div className="mx-auto grid max-w-7xl grid-cols-5 items-center px-4 py-3 md:py-4">
        {/* Col 1 — Logo + University name */}
        <Link
          href={localePath(locale, "/")}
          className="col-span-1 flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <Image
            src="/baun_logo.png"
            alt={universityName}
            width={52}
            height={52}
            className="h-11 w-11 object-contain sm:h-12 sm:w-12 md:h-13 md:w-13"
            priority
          />
          <UniversityName line1={line1} line2={line2} />
        </Link>

        {/* Col 2-3-4 — Logo text centered */}
        <Link
          href={localePath(locale, "/")}
          className="col-span-4 md:col-span-3 text-center transition-opacity hover:opacity-80"
        >
          <span className="font-bold uppercase leading-tight tracking-[0.04em] md:tracking-[0.12em] text-teal-3 dark:text-teal-2 text-xl sm:text-4xl md:text-3xl lg:text-3xl xl:text-4xl">
            {logoText}
          </span>
        </Link>

        {/* Col 5 — Turkiye logo */}
        <div className="hidden md:col-span-1 md:flex items-center justify-end">
          <Image
            src="/turkiye_logo.png"
            alt="Türkiye"
            width={52}
            height={52}
            className="h-11 w-11 object-contain sm:h-12 sm:w-12 md:h-13 md:w-13"
            priority
          />
        </div>
      </div>
    </div>
  );
}