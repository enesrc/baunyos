"use client";

import Container from "@/components/ui/Container";
import { useLanguage } from "@/features/Language/LanguageContext";
import QuickAccessCard from "@/components/ui/QuickAccessCard";
import type { QuickAccess } from "@/generated/prisma/client";

export default function QuickAccessSection({ items = [] }: { items?: QuickAccess[]; }) {
  const { translate } = useLanguage();

  if (!items.length) return null;

  return (
    <section className="border-light-3 bg-light-amber dark:border-dark-2 dark:bg-dark-4 relative">
      <div className="absolute top-0 left-0 right-0 h-16 bg-linear-to-t from-transparent to-light-3/50 dark:hidden" />
      <Container className="py-14">
        <div className="mb-8 flex flex-col items-center text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
          <h2 className="text-4xl font-bold tracking-tight text-dark-2 dark:text-light-1">
            {translate("Quick Access", "Hızlı Erişim")}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <QuickAccessCard key={item.id} item={item} />
          ))}
        </div>
      </Container>
    </section>
  );
}