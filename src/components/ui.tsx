import Image from "next/image";
import Link from "next/link";

export function SectionHero({
  title,
  subtitle,
  eyebrow
}: {
  title: string;
  subtitle: string;
  eyebrow?: string;
}) {
  return (
    <div className="px-4 pb-4 pt-6 lg:px-0">
      {eyebrow ? (
        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-neon-amber">{eyebrow}</p>
      ) : null}
      <h1 className="font-display text-3xl leading-tight text-paper md:text-4xl">{title}</h1>
      <p className="mt-2 max-w-xl text-sm text-white/60 md:text-base">{subtitle}</p>
    </div>
  );
}

export function CardLink({
  href,
  image,
  title,
  meta,
  price
}: {
  href: string;
  image: string;
  title: string;
  meta: string;
  price?: string;
}) {
  return (
    <Link
      href={href}
      className="group overflow-hidden rounded-2xl border border-white/10 bg-ink-900/50 transition hover:border-neon-cyan/40"
    >
      <div className="relative aspect-[16/10]">
        <Image src={image} alt={title} fill className="object-cover transition duration-500 group-hover:scale-105" sizes="(max-width:768px) 100vw, 400px" />
      </div>
      <div className="space-y-1 p-4">
        <h2 className="text-base font-semibold leading-snug">{title}</h2>
        <p className="text-xs text-white/50">{meta}</p>
        {price ? <p className="pt-1 text-sm font-medium text-neon-amber">{price}</p> : null}
      </div>
    </Link>
  );
}

export function BookButton({
  label = "Book now",
  href
}: {
  label?: string;
  href?: string;
}) {
  if (href) {
    return (
      <Link
        href={href}
        className="block w-full rounded-xl bg-neon-pink px-4 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-neon-pink/25 transition hover:brightness-110"
      >
        {label}
      </Link>
    );
  }
  return (
    <button
      type="button"
      className="w-full rounded-xl bg-neon-pink px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-neon-pink/25 transition hover:brightness-110"
    >
      {label}
    </button>
  );
}
