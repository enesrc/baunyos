"use client";

import Container from "@/components/ui/Container";
import { useI18n } from "@/features/i18n/I18nContextValue";
import QuickAccessCard from "@/components/ui/QuickAccessCard";
import type { QuickAccess } from "@/generated/prisma/client";

export default function QuickAccessSection({ items = [] }: { items?: QuickAccess[]; }) {
  const { dict } = useI18n();

  if (!items.length) return null;

  return (
    <section className="border-t border-light-3 bg-white dark:border-dark-2 dark:bg-dark-5">
      <Container className="py-14">
        <div className="mb-8 flex flex-col items-center text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
          <h2 className="text-4xl font-bold tracking-tight text-dark-2 dark:text-light-1">
            {dict.sections.quickAccess}
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