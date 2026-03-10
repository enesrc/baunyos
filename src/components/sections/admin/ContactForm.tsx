"use client";

import { useActionState, useState } from "react";
import { saveContact } from "@/features/contact/actions";
import type { Contact } from "@/generated/prisma/client";

const inputClass = "w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-600 transition-colors";

export default function ContactForm({ contact }: { contact: Contact }) {
  const [submitted, setSubmitted] = useState(false);
  const [error, formAction, pending] = useActionState(saveContact, null);

  return (
    <form action={formAction} onSubmit={() => setSubmitted(true)} className="flex max-w-lg flex-col gap-4">
      <input type="hidden" name="id" value={contact.id} />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Başlık (TR)</label>
          <input name="title_tr" defaultValue={contact.title_tr} className={inputClass} required />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Başlık (EN)</label>
          <input name="title_en" defaultValue={contact.title_en} className={inputClass} required />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Açıklama (TR)</label>
          <textarea name="desc_tr" defaultValue={contact.desc_tr} rows={3} className={inputClass} />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Açıklama (EN)</label>
          <textarea name="desc_en" defaultValue={contact.desc_en} rows={3} className={inputClass} />
        </div>
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">Telefon</label>
        <input name="phone" defaultValue={contact.phone} className={inputClass} />
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">E-posta</label>
        <input type="email" name="email" defaultValue={contact.email} className={inputClass} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Adres (TR)</label>
          <textarea name="address_tr" defaultValue={contact.address_tr} rows={3} className={inputClass} />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Adres (EN)</label>
          <textarea name="address_en" defaultValue={contact.address_en} rows={3} className={inputClass} />
        </div>
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">Google Maps URL</label>
        <input name="google_maps_url" defaultValue={contact.google_maps_url} className={inputClass} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Facebook</label>
          <input name="facebook" defaultValue={contact.facebook ?? ""} className={inputClass} />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Instagram</label>
          <input name="instagram" defaultValue={contact.instagram ?? ""} className={inputClass} />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Youtube</label>
          <input name="youtube" defaultValue={contact.youtube ?? ""} className={inputClass} />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">LinkedIn</label>
          <input name="linkedin" defaultValue={contact.linkedin ?? ""} className={inputClass} />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Twitter</label>
          <input name="twitter" defaultValue={contact.twitter ?? ""} className={inputClass} />
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {submitted && !pending && !error && (
        <p className="text-sm text-green-600">Kaydedildi.</p>
      )}

      <button type="submit" disabled={pending} className="w-fit bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50 transition-colors">
        {pending ? "Kaydediliyor..." : "Kaydet"}
      </button>
    </form>
  );
}