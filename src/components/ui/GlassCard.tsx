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
      className="group rounded-xl border border-black/10 bg-glass/70 p-5 shadow-soft backdrop-blur-xl transition
                 hover:-translate-y-0.5 hover:border-white/20"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold tracking-tight">{title}</div>
          <div className="mt-2 text-sm opacity-75">{description}</div>
        </div>
        <div className="mt-0.5 text-sm opacity-60 transition group-hover:opacity-100">→</div>
      </div>
    </Comp>
  );
}