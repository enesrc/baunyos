import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import { getDictionary } from "@/features/i18n/getDictionary";
import { localePath } from "@/lib/links";
import { isLocale, type Locale } from "@/features/i18n/config";
import { GradientHero } from "@/components/ui/GradientHero";
import { getContact } from "@/features/contact/queries";
import { Instagram, Twitter, Facebook, Youtube, Linkedin } from "lucide-react";


export default async function ContactPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale: raw } = await params;
    const locale: Locale = isLocale(raw) ? raw : "tr";
    const dict = await getDictionary(locale);

    // Veritabanından iletişim bilgilerini çekiyoruz
    const contact = await getContact();

    const isTr = locale === "tr";

    // İçerik yönetimini veritabanı öncelikli yapıyoruz
    const content = {
        breadcrumbHome: dict.common?.home ?? (isTr ? "Ana Sayfa" : "Home"),
        pageTitle: isTr ? contact.title_tr : contact.title_en,
        heroTitle: isTr ? "Bir sorunuz mu var?" : "Do you have a question?",
        heroDesc: isTr ? contact.desc_tr : contact.desc_en,
        contactInfoTitle: isTr ? "İletişim Bilgileri" : "Contact Information",
        addressLabel: isTr ? "Adres" : "Address",
        phoneLabel: isTr ? "Telefon" : "Phone",
        emailLabel: isTr ? "E-posta" : "Email",
        mapTitle: isTr ? "Konumumuz" : "Our Location",
        addressText: isTr ? contact.address_tr : contact.address_en,
    };

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
                                {contact.phone && (
                                    <a
                                        href={`tel:${contact.phone.replace(/\s/g, "")}`}
                                        className="flex gap-4 rounded-md border border-light-3 bg-light-1 p-5 transition-colors hover:border-teal-3 dark:border-dark-1 dark:bg-dark-2 dark:hover:border-teal-2"
                                    >
                                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-teal-1 text-teal-3 dark:bg-teal-4 dark:text-teal-1">
                                            <Phone size={18} />
                                        </div>
                                        <div>
                                            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-teal-3 dark:text-teal-2">
                                                {content.phoneLabel}
                                            </p>
                                            <p className="text-sm text-gray-4 dark:text-gray-2">{contact.phone}</p>
                                        </div>
                                    </a>
                                )}

                                {/* E-posta */}
                                {contact.email && (
                                    <a
                                        href={`mailto:${contact.email}`}
                                        className="flex gap-4 rounded-md border border-light-3 bg-light-1 p-5 transition-colors hover:border-teal-3 dark:border-dark-1 dark:bg-dark-2 dark:hover:border-teal-2"
                                    >
                                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-teal-1 text-teal-3 dark:bg-teal-4 dark:text-teal-1">
                                            <Mail size={18} />
                                        </div>
                                        <div>
                                            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-teal-3 dark:text-teal-2">
                                                {content.emailLabel}
                                            </p>
                                            <p className="text-sm text-gray-4 dark:text-gray-2">{contact.email}</p>
                                        </div>
                                    </a>
                                )}

                                {(contact.instagram || contact.twitter || contact.facebook || contact.youtube || contact.linkedin) && (
                                    <div className="rounded-md border border-light-3 bg-light-1 p-5 dark:border-dark-1 dark:bg-dark-2">
                                        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-teal-3 dark:text-teal-2">
                                            {isTr ? "Sosyal Medya" : "Social Media"}
                                        </p>
                                        <div className="flex items-center gap-3">
                                            {contact.instagram && (
                                                <a href={contact.instagram} target="_blank" rel="noopener noreferrer"
                                                    className="flex h-9 w-9 items-center justify-center rounded-md bg-teal-1 text-teal-3 transition-colors hover:bg-teal-3 hover:text-white dark:bg-teal-4 dark:text-teal-1 dark:hover:bg-teal-2 dark:hover:text-white">
                                                    <Instagram size={18} />
                                                </a>
                                            )}
                                            {contact.twitter && (
                                                <a href={contact.twitter} target="_blank" rel="noopener noreferrer"
                                                    className="flex h-9 w-9 items-center justify-center rounded-md bg-teal-1 text-teal-3 transition-colors hover:bg-teal-3 hover:text-white dark:bg-teal-4 dark:text-teal-1 dark:hover:bg-teal-2 dark:hover:text-white">
                                                    <Twitter size={18} />
                                                </a>
                                            )}
                                            {contact.facebook && (
                                                <a href={contact.facebook} target="_blank" rel="noopener noreferrer"
                                                    className="flex h-9 w-9 items-center justify-center rounded-md bg-teal-1 text-teal-3 transition-colors hover:bg-teal-3 hover:text-white dark:bg-teal-4 dark:text-teal-1 dark:hover:bg-teal-2 dark:hover:text-white">
                                                    <Facebook size={18} />
                                                </a>
                                            )}
                                            {contact.youtube && (
                                                <a href={contact.youtube} target="_blank" rel="noopener noreferrer"
                                                    className="flex h-9 w-9 items-center justify-center rounded-md bg-teal-1 text-teal-3 transition-colors hover:bg-teal-3 hover:text-white dark:bg-teal-4 dark:text-teal-1 dark:hover:bg-teal-2 dark:hover:text-white">
                                                    <Youtube size={18} />
                                                </a>
                                            )}
                                            {contact.linkedin && (
                                                <a href={contact.linkedin} target="_blank" rel="noopener noreferrer"
                                                    className="flex h-9 w-9 items-center justify-center rounded-md bg-teal-1 text-teal-3 transition-colors hover:bg-teal-3 hover:text-white dark:bg-teal-4 dark:text-teal-1 dark:hover:bg-teal-2 dark:hover:text-white">
                                                    <Linkedin size={18} />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sağ: Harita */}
                        <div className="lg:col-span-3">
                            <h2 className="mb-6 text-xl font-bold tracking-tight text-dark-2 dark:text-light-1">
                                {content.mapTitle}
                            </h2>
                            <div className="overflow-hidden rounded-md border border-light-3 dark:border-dark-1">
                                {contact.google_maps_url ? (
                                    <iframe
                                        title={content.mapTitle}
                                        width="100%"
                                        height="380"
                                        style={{ border: 0 }}
                                        loading="lazy"
                                        allowFullScreen
                                        referrerPolicy="no-referrer-when-downgrade"
                                        src={contact.google_maps_url}
                                    />
                                ) : (
                                    <div className="flex h-95 items-center justify-center bg-gray-100 text-gray-400">
                                        Harita henüz eklenmedi.
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </main>
    );
}