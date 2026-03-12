import Link from "next/link";
import { MapPinIcon, PhoneIcon, EnvelopeIcon } from "@phosphor-icons/react/ssr";
import { langPath } from "@/features/Language/lang-path";
import { parseLang, type Lang } from "@/features/Language/config";
import { GradientHero } from "@/components/ui/GradientHero";
import { getContact } from "@/features/contact/queries";
import { FaInstagram, FaFacebookF, FaLinkedinIn, FaYoutube, FaXTwitter } from "react-icons/fa6";
import { translate } from "@/features/Language/translate";

export default async function ContactPage({ params }: { params: Promise<{ lang: string }>; }) {
  const { lang: raw } = await params;
  const lang: Lang = parseLang(raw);

  const contact = (await getContact())!;

  return (
    <>
      <GradientHero>
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex items-center gap-2 text-sm text-light-4">
            <Link
              href={langPath(lang, "/")}
              className="font-medium transition-colors hover:text-white hover:underline"
            >
              {translate(lang, "Home", "Ana Sayfa")}
            </Link>
            <span>/</span>
            <span className="font-medium text-white">{translate(lang, "Contact", "İletişim")}</span>
          </nav>
        </div>

        <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white">
          {translate(lang, contact.title_en, contact.title_tr)}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-light-4">
          {translate(lang, contact.desc_en, contact.desc_tr)}
        </p>
      </GradientHero>

      {/* İçerik */}
      <section className="bg-light-2 dark:bg-dark-3">
        <div className="mx-auto max-w-5xl px-6 py-12">
          <div className="grid gap-8 lg:grid-cols-5">

            {/* Sol: İletişim Bilgileri */}
            <div className="lg:col-span-2">
              <h2 className="mb-6 text-xl font-bold tracking-tight text-dark-2 dark:text-light-1">
                {translate(lang, "Contact Information", "İletişim Bilgileri")}
              </h2>

              <div className="flex flex-col gap-5">
                {/* Adres */}
                <div className="flex gap-4 rounded-md border border-light-3 bg-light-1 p-5 dark:border-dark-1 dark:bg-dark-2">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-teal-1 text-teal-3 dark:bg-teal-4 dark:text-teal-1">
                    <MapPinIcon size={18} />
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-teal-3 dark:text-teal-2">
                      {translate(lang, "Address", "Adres")}
                    </p>
                    <p className="text-sm leading-relaxed text-gray-4 dark:text-gray-2">
                      {translate(lang, contact.address_en, contact.address_tr)}
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
                      <PhoneIcon size={18} />
                    </div>
                    <div>
                      <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-teal-3 dark:text-teal-2">
                        {translate(lang, "Phone", "Telefon")}
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
                      <EnvelopeIcon size={18} />
                    </div>
                    <div>
                      <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-teal-3 dark:text-teal-2">
                        {translate(lang, "Email", "E-posta")}
                      </p>
                      <p className="text-sm text-gray-4 dark:text-gray-2">{contact.email}</p>
                    </div>
                  </a>
                )}

                {(contact.instagram || contact.twitter || contact.facebook || contact.youtube || contact.linkedin) && (
                  <div className="rounded-md border border-light-3 bg-light-1 p-5 dark:border-dark-1 dark:bg-dark-2">
                    <div className="flex items-center gap-3">
                      {contact.instagram && (
                        <a href={contact.instagram} target="_blank" rel="noopener noreferrer"
                          className="flex h-9 w-9 items-center justify-center rounded-md bg-teal-1 text-teal-3 transition-colors hover:bg-teal-3 hover:text-white dark:bg-teal-4 dark:text-teal-1 dark:hover:bg-teal-2 dark:hover:text-white">
                          <FaInstagram size={18} />
                        </a>
                      )}
                      {contact.twitter && (
                        <a href={contact.twitter} target="_blank" rel="noopener noreferrer"
                          className="flex h-9 w-9 items-center justify-center rounded-md bg-teal-1 text-teal-3 transition-colors hover:bg-teal-3 hover:text-white dark:bg-teal-4 dark:text-teal-1 dark:hover:bg-teal-2 dark:hover:text-white">
                          <FaXTwitter size={18} />
                        </a>
                      )}
                      {contact.facebook && (
                        <a href={contact.facebook} target="_blank" rel="noopener noreferrer"
                          className="flex h-9 w-9 items-center justify-center rounded-md bg-teal-1 text-teal-3 transition-colors hover:bg-teal-3 hover:text-white dark:bg-teal-4 dark:text-teal-1 dark:hover:bg-teal-2 dark:hover:text-white">
                          <FaFacebookF size={18} />
                        </a>
                      )}
                      {contact.youtube && (
                        <a href={contact.youtube} target="_blank" rel="noopener noreferrer"
                          className="flex h-9 w-9 items-center justify-center rounded-md bg-teal-1 text-teal-3 transition-colors hover:bg-teal-3 hover:text-white dark:bg-teal-4 dark:text-teal-1 dark:hover:bg-teal-2 dark:hover:text-white">
                          <FaYoutube size={18} />
                        </a>
                      )}
                      {contact.linkedin && (
                        <a href={contact.linkedin} target="_blank" rel="noopener noreferrer"
                          className="flex h-9 w-9 items-center justify-center rounded-md bg-teal-1 text-teal-3 transition-colors hover:bg-teal-3 hover:text-white dark:bg-teal-4 dark:text-teal-1 dark:hover:bg-teal-2 dark:hover:text-white">
                          <FaLinkedinIn size={18} />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sağ: Harita */}
            <div className="lg:col-span-3 flex flex-col">
              <h2 className="mb-6 text-xl font-bold tracking-tight text-dark-2 dark:text-light-1">
                {translate(lang, "Our Location", "Konumumuz")}
              </h2>
              <div className="flex-1 overflow-hidden rounded-md border border-light-3 dark:border-dark-1 min-h-80">
                {contact.google_maps_url ? (
                  <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0, display: "block" }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={contact.google_maps_url}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gray-100 text-gray-400">
                    Harita henüz eklenmedi.
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}