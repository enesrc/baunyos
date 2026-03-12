import { FaInstagram, FaFacebookF, FaLinkedinIn, FaYoutube, FaXTwitter } from "react-icons/fa6";
import type { Contact } from "@/generated/prisma/client";

export default function SocialMediaButtons({ contact }: { contact: Contact }) {

  const SOCIAL_LINKS = [
    { icon: FaFacebookF, href: contact.facebook, label: "Facebook", hoverClass: "hover:bg-[#0064E0] hover:text-white" },
    { icon: FaInstagram, href: contact.instagram, label: "Instagram", hoverClass: "hover:bg-[radial-gradient(circle_at_bottom_left,#feda3e_0%,#f97316_30%,#d62976_60%,#962fbf_85%,#4f5bd5_100%)] hover:text-white" },
    { icon: FaLinkedinIn, href: contact.linkedin, label: "Linkedin", hoverClass: "hover:bg-[#0A66C2] hover:text-white" },
    { icon: FaYoutube, href: contact.youtube, label: "Youtube", hoverClass: "hover:bg-[#FF0033] hover:text-white" },
    { icon: FaXTwitter, href: contact.twitter, label: "Twitter", hoverClass: "hover:bg-black hover:text-white" },
  ].filter((link) => link.href);

  return (
    <>
      {
        SOCIAL_LINKS.map(({ icon: Icon, href, label, hoverClass }) => (
          <a
            key={label}
            href={href!}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className={`flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white transition-all dark:bg-white/10 dark:text-white/70 ${hoverClass} dark:${hoverClass}`}
          >
            <Icon size={22} />
          </a>
        ))
      }
    </>
  )

}

