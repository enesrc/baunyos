import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import { getSiteSettings } from "@/features/site-settings/queries";
import { getDictionary } from "@/features/i18n/getDictionary";
import { localePath } from "@/lib/links";
import { isLocale, type Locale } from "@/features/i18n/config";
import { GradientHero } from "@/components/ui/GradientHero";

export default async function ContactPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale: raw } = await params;
    const locale: Locale = isLocale(raw) ? raw : "tr";
    const dict = await getDictionary(locale);
    const settings = await getSiteSettings();

    const isTr = locale === "tr";

    const content = {
        breadcrumbHome: dict.common?.home ?? (isTr ? "Ana Sayfa" : "Home"),
        pageTitle: isTr ? "İletişim" : "Contact",
        heroTitle: isTr ? "Bir sorunuz mu var?" : "Do you have a question?",
        heroDesc: isTr
            ? "Bir sorunuz olduğunda aşağıda yer alan e-posta, telefon bilgilerinden ya da adreste yer alan ofisimizden bize ulaşabilirsiniz."
            : "If you have a question, you can reach us via the email and phone information below, or visit our office at the address listed.",
        contactInfoTitle: isTr ? "İletişim Bilgileri" : "Contact Information",
        addressLabel: isTr ? "Adres" : "Address",
        phoneLabel: isTr ? "Telefon" : "Phone",
        emailLabel: isTr ? "E-posta" : "Email",
        mapTitle: isTr ? "Konumumuz" : "Our Location",
        addressText: isTr
            ? "Uluslararası İlişkiler Araştırma ve Uygulama Merkezi, Rektörlük Binası, 5. Kat, Çağış Kampüsü, 10145, Balıkesir"
            : "International Relations Research and Application Center, Rectorate Building, 5th Floor, Çağış Campus, 10145, Balıkesir",
    };

    // Balıkesir Üniversitesi Çağış Kampüsü koordinatları
    const mapSrc = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1538.4109306420683!2d28.006475443393864!3d39.54107245611049!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14b7a938119cd519%3A0x1aada3bfd36ee91d!2zQmFsxLFrZXNpciDDnG5pdmVyc2l0ZXNpIFJla3TDtnJsw7xrIEJpbmFzxLE!5e0!3m2!1str!2str!4v1772696378504!5m2!1str!2str"

    return (
        <main>
            <GradientHero>
                {/* Breadcrumb */}
                <div className="mb-6">
                    <nav className="flex items-center gap-2 text-sm text-light-4">
                        <Link
                            href={localePath(locale, "/")}
                            className="font-medium transition-colors hover:text-white hover:underline"
                        >
                            {content.breadcrumbHome}
                        </Link>
                        <span>/</span>
                        <span className="font-medium text-white">{content.pageTitle}</span>
                    </nav>
                </div>

                <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white">
                    {content.heroTitle}
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-light-4">
                    {content.heroDesc}
                </p>
            </GradientHero>

            {/* İçerik */}
            <section className="bg-light-2 dark:bg-dark-3">
                <div className="mx-auto max-w-5xl px-6 py-12">
                    <div className="grid gap-8 lg:grid-cols-5">

                        {/* Sol: İletişim Bilgileri */}
                        <div className="lg:col-span-2">
                            <h2 className="mb-6 text-xl font-bold tracking-tight text-dark-2 dark:text-light-1">
                                {content.contactInfoTitle}
                            </h2>

                            <div className="flex flex-col gap-5">
                                {/* Adres */}
                                <div className="flex gap-4 rounded-md border border-light-3 bg-light-1 p-5 dark:border-dark-1 dark:bg-dark-2">
                                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-teal-1 text-teal-3 dark:bg-teal-4 dark:text-teal-1">
                                        <MapPin size={18} />
                                    </div>
                                    <div>
                                        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-teal-3 dark:text-teal-2">
                                            {content.addressLabel}
                                        </p>
                                        <p className="text-sm leading-relaxed text-gray-4 dark:text-gray-2">
                                            {content.addressText}
                                        </p>
                                    </div>
                                </div>

                                {/* Telefon */}
                                {settings.phone && (
                                    <a
                                        href={`tel:${settings.phone.replace(/\s/g, "")}`}
                                        className="flex gap-4 rounded-md border border-light-3 bg-light-1 p-5 transition-colors hover:border-teal-3 dark:border-dark-1 dark:bg-dark-2 dark:hover:border-teal-2"
                                    >
                                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-teal-1 text-teal-3 dark:bg-teal-4 dark:text-teal-1">
                                            <Phone size={18} />
                                        </div>
                                        <div>
                                            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-teal-3 dark:text-teal-2">
                                                {content.phoneLabel}
                                            </p>
                                            <p className="text-sm text-gray-4 dark:text-gray-2">{settings.phone}</p>
                                        </div>
                                    </a>
                                )}

                                {/* E-posta */}
                                {settings.email && (
                                    <a
                                        href={`mailto:${settings.email}`}
                                        className="flex gap-4 rounded-md border border-light-3 bg-light-1 p-5 transition-colors hover:border-teal-3 dark:border-dark-1 dark:bg-dark-2 dark:hover:border-teal-2"
                                    >
                                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-teal-1 text-teal-3 dark:bg-teal-4 dark:text-teal-1">
                                            <Mail size={18} />
                                        </div>
                                        <div>
                                            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-teal-3 dark:text-teal-2">
                                                {content.emailLabel}
                                            </p>
                                            <p className="text-sm text-gray-4 dark:text-gray-2">{settings.email}</p>
                                        </div>
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Sağ: Harita */}
                        <div className="lg:col-span-3">
                            <h2 className="mb-6 text-xl font-bold tracking-tight text-dark-2 dark:text-light-1">
                                {content.mapTitle}
                            </h2>
                            <div className="overflow-hidden rounded-md border border-light-3 dark:border-dark-1">
                                <iframe
                                    title={content.mapTitle}
                                    width="100%"
                                    height="380"
                                    style={{ border: 0 }}
                                    loading="lazy"
                                    allowFullScreen
                                    referrerPolicy="no-referrer-when-downgrade"
                                    src= {mapSrc}
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </main>
    );
}