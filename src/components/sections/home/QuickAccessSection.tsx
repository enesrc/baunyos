"use client";

import { localePath, EXTERNAL_LINKS } from "@/lib/links";
import Container from "@/components/ui/Container";
import GlassCard from "@/components/ui/GlassCard";
import { useI18n } from "@/features/i18n/I18nContextValue";

export default function QuickAccessSection() {
  const { locale } = useI18n();

  return (
    <section id="quick" className="border-t border-light-3 bg-light-2 dark:border-dark-2 dark:bg-dark-3">
      <Container className="py-14">
        <div className="mb-8">
          <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-teal-3 dark:text-teal-2">
            Quick Access
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-dark-2 dark:text-light-1">
            title
          </h2>
          <p className="mt-2 text-sm text-gray-3 dark:text-gray-2">desc</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <GlassCard
            title="Online Application"
            description="Redirect to the official application system."
            href={EXTERNAL_LINKS.apply}
            external
          />
          <GlassCard
            title="Application Process"
            description="Steps, timeline, and required documents."
            href={localePath(locale, "/candidates")}
          />
          <GlassCard
            title="Tuition Fees"
            description="Updated tuition tables and payment guidance."
            href={localePath(locale, "/tuition-fees")}
          />
          <GlassCard
            title="FAQ"
            description="Most common questions answered clearly."
            href={localePath(locale, "/faq")}
          />
          <GlassCard
            title="Accommodation"
            description="Housing options and dormitory information."
            href={localePath(locale, "/students")}
          />
          <GlassCard
            title="Living in Balıkesir"
            description="City guide for international students."
            href={localePath(locale, "/students")}
          />
          <GlassCard
            title="Diploma Supplement"
            description="Official diploma supplement information."
            href={localePath(locale, "/diploma-supplement")}
          />
        </div>
      </Container>
    </section>
  );
}