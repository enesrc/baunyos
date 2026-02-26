import { useI18n } from "@/features/i18n/I18nContextValue";

export default function Footer() {
  const { locale } = useI18n()
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm opacity-75">
        © {new Date().getFullYear()} BAUN YÖS • /{locale}
      </div>
    </footer>
  );
}