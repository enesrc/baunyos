import { getContact } from "@/features/contact/queries";
import ContactForm from "@/components/sections/admin/ContactForm";

export default async function ContactPage() {
  const contact = await getContact();
  return <ContactForm contact={contact} />;
}