import Image from "next/image";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";

export function CatalogDetail({
  image,
  title,
  eyebrow,
  meta,
  description,
  price,
  chips,
  listItems,
  listOrdered,
  ctaLabel = "Partner booking soon",
  secondaryLinks
}: {
  image: string;
  title: string;
  eyebrow?: string;
  meta: string;
  description: string;
  price?: string;
  chips?: string[];
  listItems?: string[];
  listOrdered?: boolean;
  ctaLabel?: string;
  secondaryLinks?: { href: string; label: string }[];
}) {
  const ListTag = listOrdered ? "ol" : "ul";

  return (
    <PageShell>
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-ink-900/50">
        <div className="relative aspect-[16/10]">
          <Image src={image} alt={title} fill className="object-cover" sizes="100vw" />
        </div>
        <div className="space-y-3 p-5">
          {eyebrow ? <p className="text-xs uppercase tracking-wider text-neon-amber">{eyebrow}</p> : null}
          <h1 className="font-display text-3xl">{title}</h1>
          <p className="text-sm text-white/55">{meta}</p>
          <p className="text-base text-white/80">{description}</p>
          {chips?.length ? (
            <ul className="flex flex-wrap gap-2">
              {chips.map((a) => (
                <li key={a} className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/70">
                  {a}
                </li>
              ))}
            </ul>
          ) : null}
          {listItems?.length ? (
            <ListTag
              className={
                listOrdered
                  ? "list-decimal space-y-1 pl-5 text-sm text-white/75"
                  : "list-disc space-y-1 pl-5 text-sm text-white/75"
              }
            >
              {listItems.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ListTag>
          ) : null}
          {price ? <p className="text-xl font-semibold text-neon-amber">{price}</p> : null}
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              disabled
              className="w-full flex-1 cursor-not-allowed rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white/45"
            >
              {ctaLabel}
            </button>
            {secondaryLinks?.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-xl border border-white/20 px-4 py-3 text-center text-sm text-white/80 hover:border-neon-cyan/50"
              >
                {l.label}
              </Link>
            ))}
          </div>
          <p className="text-xs text-white/40">
            Live inventory needs partner APIs (Expedia / Klook). Browse catalog only for now.
          </p>
        </div>
      </div>
    </PageShell>
  );
}
