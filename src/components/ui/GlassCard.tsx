import Link from "next/link";

export default function GlassCard({
  title,
  description,
  href,
  external,
}: {
  title: string;
  description: string;
  href: string;
  external?: boolean;
}) {
  const Comp: "a" | typeof Link = external ? "a" : Link;
  const props = external
    ? { href, target: "_blank", rel: "noopener noreferrer" }
    : { href };

  return (
    <Comp
      {...props}
      className="group flex flex-col justify-between rounded-xl border border-light-3 bg-light-1 p-5 shadow-sm
                 transition-all duration-200 hover:-translate-y-0.5 hover:border-teal-3 hover:shadow-md
                 dark:border-dark-1 dark:bg-dark-2 dark:hover:border-teal-3"
    >
      <div>
        <div className="text-sm font-semibold tracking-tight text-dark-2 dark:text-light-2">
          {title}
        </div>
        <div className="mt-2 text-sm leading-relaxed text-gray-3 dark:text-gray-2">
          {description}
        </div>
      </div>
      <div className="mt-4 text-xs font-medium text-teal-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100 dark:text-teal-2">
        Devam et →
      </div>
    </Comp>
  );
}