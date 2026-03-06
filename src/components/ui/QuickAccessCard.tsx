import Link from "next/link";
import { ArrowUpRightIcon } from "@phosphor-icons/react/ssr";
import { ICON_MAP, FallbackIcon } from "@/lib/iconMap";
import type { QuickAccessGetPayload } from "@/generated/prisma/models/QuickAccess";
import type { Locale } from "@/features/i18n/config";

type QuickAccess = QuickAccessGetPayload<Record<string, never>>;

interface QuickAccessCardProps {
  item: QuickAccess;
  locale: Locale;
}

export default function QuickAccessCard({ item, locale }: QuickAccessCardProps) {
  const title = locale === "tr" ? item.title_tr : item.title_en;
  const description = locale === "tr" ? item.desc_tr : item.desc_en;

  const isExternal =
    item.href.startsWith("http://") || item.href.startsWith("https://");
  const linkProps = isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {};

  const Icon = (item.icon && ICON_MAP[item.icon]) ? ICON_MAP[item.icon] : FallbackIcon;

  return (
    <Link
      href={item.href}
      {...linkProps}
      className="group rounded-md border border-light-3 bg-white transition-all hover:border-teal-3 hover:shadow-sm dark:border-dark-2 dark:bg-dark-3 dark:hover:border-teal-3

        /* Mobil: ikon üstte, başlık altta, ortalı */
        flex flex-col items-center justify-center gap-2 p-4 text-center

        /* sm+: yatay düzen */
        sm:flex-row sm:items-start sm:justify-start sm:gap-4 sm:p-5 sm:text-left"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-teal-4/10 text-teal-3 transition-colors group-hover:bg-teal-4/20 dark:bg-teal-4/20 dark:text-teal-2">
        <Icon size={22} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-base font-semibold text-dark-2 transition-colors group-hover:text-teal-3 dark:text-light-1 dark:group-hover:text-teal-2
          sm:truncate">
          {title}
        </p>
        {description && (
          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-dark-4 dark:text-light-3
            hidden sm:block">
            {description}
          </p>
        )}
      </div>

      <ArrowUpRightIcon
        size={16}
        className="hidden sm:block mt-1 shrink-0 text-light-3 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-teal-3 dark:text-dark-1 dark:group-hover:text-teal-2"
      />
    </Link>
  );
}