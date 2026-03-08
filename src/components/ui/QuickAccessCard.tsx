import Link from "next/link";
import { ArrowUpRightIcon } from "@phosphor-icons/react/ssr";
import { ICON_MAP, FallbackIcon } from "@/lib/iconMap";
import type { QuickAccess } from "@/generated/prisma/client";
import { useI18n } from "@/features/i18n/I18nContextValue";

export default function QuickAccessCard({ item }: { item: QuickAccess }) {
  const { locale } = useI18n();
  const title = locale === "tr" ? item.title_tr : item.title_en;
  const description = locale === "tr" ? item.desc_tr : item.desc_en;

  const isExternal = item.href.startsWith("http://") || item.href.startsWith("https://");
  const linkProps = isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {};
  const Icon = (item.icon && ICON_MAP[item.icon]) ? ICON_MAP[item.icon] : FallbackIcon;

  return (
    <Link
      href={item.href}
      {...linkProps}
      className="group relative overflow-hidden border border-light-3 bg-white p-4 transition-all 
        hover:border-amber hover:shadow-lg 
        dark:border-dark-2 dark:bg-dark-2 dark:hover:border-amber-bright
        flex flex-col items-center justify-center gap-2 text-center
        sm:flex-row sm:items-start sm:justify-start sm:gap-4 sm:p-5 sm:text-left"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md 
        bg-amber/10 text-amber transition-colors 
        group-hover:bg-amber/20 dark:bg-amber-dull/20 dark:text-amber-bright dark:group-hover:bg-amber-dull/30">
        <Icon size={26} weight="duotone" /> 
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-lg font-medium text-dark-2 transition-colors 
          group-hover:text-amber-dull dark:text-light-1 dark:group-hover:text-amber-bright
          sm:truncate">
          {title}
        </p>
        
        {description && (
          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-gray-4 dark:text-light-4
            hidden sm:block">
            {description}
          </p>
        )}
      </div>

      <ArrowUpRightIcon
        size={16}
        className="hidden sm:block mt-1 shrink-0 text-light-4 transition-all 
          group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-amber
          dark:text-light-4 dark:group-hover:text-amber-bright"
      />
    </Link>
  );
}