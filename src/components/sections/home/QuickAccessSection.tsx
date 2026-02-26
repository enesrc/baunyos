"use client";

import { lpath, EXTERNAL_LINKS } from "@/lib/links";
import Container from "@/components/ui/Container";
import GlassCard from "@/components/ui/GlassCard";
import { useI18n } from "@/features/i18n/I18nContextValue";

export default function QuickAccessSection() {
  const { dict, locale } = useI18n();

  return (
    <section id="quick" className="border-t border-border">
      <Container className="py-12">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">{dict.home.quick.title}</h2>
          <p className="mt-2 text-sm opacity-75">
            {dict.home.quick.desc}
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <GlassCard
            title="Online Application"
            description="Redirect to the official application system."
            href={EXTERNAL_LINKS.apply}
            external
          />

          <GlassCard
            title="Application Process"
            description="Steps, timeline, and required documents."
            href={lpath(locale, "/candidates")}
          />

          <GlassCard
            title="Tuition Fees"
            description="Updated tuition tables and payment guidance."
            href={lpath(locale, "/tuition-fees")}
          />

          <GlassCard title="FAQ" description="Most common questions answered clearly." href={lpath(locale, "/faq")} />
          <GlassCard title="Accommodation" description="Housing options and dormitory information." href={lpath(locale, "/students")} />
          <GlassCard title="Living in Balıkesir" description="City guide for international students." href={lpath(locale, "/students")} />
          <GlassCard
            title="Diploma Supplement"
            description="Official diploma supplement information."
            href={lpath(locale, "/diploma-supplement")}
          />
        </div>
      </Container>
    </section>
  );
}