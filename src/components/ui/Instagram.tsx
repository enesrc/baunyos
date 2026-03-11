import { FaInstagram } from "react-icons/fa6";

export default function InstagramButton({ href }: { href: string }) {

  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Instagram"
      className="
        /* Diğerleriyle birebir aynı ölçü ve yuvarlaklık */
        flex h-12 w-12 items-center justify-center 
        rounded-full bg-white/15 text-white 
        dark:bg-white/10 dark:text-white/70 
        
        transition-all duration-300 

        /* background-clip: border-box ile tüm alanı kaplar */
        hover:bg-[radial-gradient(circle_at_bottom_left,#feda3e_0%,#f97316_30%,#d62976_60%,#962fbf_85%,#4f5bd5_100%)] hover:text-white 
        hover:shadow-lg
      "
    >
      <FaInstagram size={22} />
    </a>
  );
}