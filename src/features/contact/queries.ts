import { prisma } from "@/lib/prisma";

export async function getContact() {
  const contact = await prisma.contact.findFirst();

  if (!contact) {
    return {
      id: 1,
      title_tr: "İletişim",
      title_en: "Contact",
      desc_tr: "",
      desc_en: "",
      phone: "+90 266 612 14 00",
      email: "yos@balikesir.edu.tr",
      address_tr: "Çağış Yerleşkesi, Balıkesir",
      address_en: "Cagis Campus, Balikesir",
      google_maps_url: "",
      facebook: "",
      instagram: "",
      youtube: "",
      linkedin: "",
      twitter: "",
    };
  }

  return contact;
}