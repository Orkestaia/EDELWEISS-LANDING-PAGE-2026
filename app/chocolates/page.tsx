import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Leaf, GlassWater, Sparkles, MapPin } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { EdelweissMark } from "@/components/EdelweissMark";
import { AlpineSilhouette } from "@/components/AlpineBackground";
import {
  chocolates,
  chocolateGroups,
  chocolateGroupDescriptions,
  type ChocolateGroup,
} from "@/lib/chocolates";

export const metadata: Metadata = {
  title: "The Chocolate Boutique · Edelweiss Pastry Shop",
  description:
    "Hand-rolled Swiss truffles and seasonal bonbons crafted in small batches with premium Felchlin chocolate. Available exclusively in our Biddeford boutique.",
};

const allergenIcon = (a: string) => {
  if (a === "Alcohol") return <GlassWater size={11} />;
  if (a === "Tree nuts" || a === "Coconut") return <Leaf size={11} />;
  return <Sparkles size={11} />;
};

export default function ChocolatesPage() {
  return (
    <main className="min-h-screen bg-cocoa text-cream-50">
      <Navbar />

      {/* ───── HERO STRIP (boutique presentation) ───── */}
      <section className="relative pt-28 sm:pt-36">
        <div className="mx-auto max-w-5xl px-5 sm:px-8 text-center">
          <Reveal>
            <div className="flex justify-center text-mustard">
              <EdelweissMark size={42} />
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="mt-6 text-[0.7rem] uppercase tracking-[0.34em] text-mustard/85">
              The Chocolate Boutique
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="mt-5 font-display text-4xl sm:text-6xl lg:text-[4.6rem] leading-[1.04]">
              Hand-rolled in Maine,
              <span className="block italic text-mustard">
                with Swiss patience.
              </span>
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mx-auto mt-7 max-w-2xl text-base sm:text-lg leading-relaxed text-cream-50/80">
              Each truffle and bonbon is made by hand, in small batches, using
              premium Felchlin chocolate from Switzerland. A quiet, patient
              craft — closer to jewelry than confection.
            </p>
          </Reveal>

          {/* In-store-only callout (the key message) */}
          <Reveal delay={0.18}>
            <div className="mx-auto mt-12 max-w-3xl rounded-2xl border border-mustard/30 bg-cream-50/[0.04] backdrop-blur-sm px-6 py-7 sm:px-10 sm:py-9">
              <div className="flex items-center justify-center gap-2 text-mustard">
                <MapPin size={15} />
                <span className="text-[0.7rem] uppercase tracking-[0.3em]">
                  Available exclusively in our boutique
                </span>
              </div>
              <p className="mt-4 text-cream-50/85 leading-relaxed text-[0.98rem] sm:text-base">
                Our chocolates are not sold online. The collection below is a
                window into our craft — a curated selection that{" "}
                <em className="text-mustard/90 not-italic font-medium">
                  rotates with the seasons
                </em>
                . Not every piece shown here is in store at any given moment;
                what is on the counter today depends on the week, the harvest,
                and what Alex is tempering this morning.
              </p>
              <p className="mt-4 text-cream-50/65 text-sm">
                Visit us Tuesday through Sunday, 7am – 2pm.{" "}
                <Link
                  href="/#visit"
                  className="underline underline-offset-4 hover:text-mustard transition-colors"
                >
                  Find the boutique →
                </Link>
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───── COLLECTION ───── */}
      <section className="relative isolate mt-20 sm:mt-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 pb-24 sm:pb-32 space-y-20 sm:space-y-28">
          {chocolateGroups.map((group) => (
            <ChocolateGroupSection key={group} group={group} />
          ))}
        </div>
      </section>

      {/* ───── ARTISTRY / father's craft strip ───── */}
      <section className="relative isolate overflow-hidden border-t border-cream-50/10">
        <AlpineSilhouette
          tone="cream"
          className="absolute inset-x-0 bottom-0 w-full h-44 opacity-[0.05]"
        />
        <div className="mx-auto max-w-4xl px-5 sm:px-8 py-24 sm:py-32 text-center">
          <Reveal>
            <p className="text-[0.7rem] uppercase tracking-[0.32em] text-mustard/80">
              A family craft
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-5 font-display text-3xl sm:text-5xl leading-[1.08]">
              Closer to a jewelry counter
              <span className="block italic text-mustard">
                than a candy shelf.
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mx-auto mt-7 max-w-2xl text-cream-50/75 leading-relaxed">
              We invite you to step inside, take your time at the counter, and
              build the assortment that is right for you. Six pieces, twelve,
              twenty-four — a single 65% Maracaibo or one of everything. We
              will pack it by hand.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/#visit"
                className="inline-flex items-center gap-2 rounded-full bg-mustard text-cocoa px-7 py-3.5 text-sm uppercase tracking-[0.22em] hover:bg-cream-50 transition-colors"
              >
                Visit the boutique
              </Link>
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 rounded-full border border-cream-50/30 text-cream-50 px-7 py-3.5 text-sm uppercase tracking-[0.22em] hover:bg-cream-50/10 transition-colors"
              >
                See the full menu
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function ChocolateGroupSection({ group }: { group: ChocolateGroup }) {
  const items = chocolates.filter((c) => c.group === group);
  return (
    <div>
      {/* Group header */}
      <div className="text-center max-w-3xl mx-auto pb-12 border-b border-cream-50/10">
        <Reveal>
          <p className="text-[0.7rem] uppercase tracking-[0.32em] text-mustard/85">
            {group === "Truffles"
              ? "The permanent collection"
              : group === "Bonbons"
              ? "Seasonal rotation"
              : "The 2026 collection"}
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-4 font-display text-3xl sm:text-5xl leading-[1.06]">
            {group}
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="mx-auto mt-4 max-w-xl text-sm sm:text-base text-cream-50/65 leading-relaxed">
            {chocolateGroupDescriptions[group]}
          </p>
        </Reveal>
      </div>

      <ul className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14 sm:gap-y-16">
        {items.map((c, i) => (
          <Reveal key={c.slug} delay={(i % 3) * 0.05} as="li">
            <figure className="group text-center">
              {/* Pedestal / spotlight */}
              <div className="relative mx-auto aspect-square w-44 sm:w-52 lg:w-56">
                <div
                  aria-hidden
                  className="absolute inset-0 rounded-full bg-mustard/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                />
                <Image
                  src={c.image}
                  alt={c.name}
                  fill
                  sizes="(max-width: 640px) 70vw, (max-width: 1024px) 30vw, 220px"
                  className="object-contain transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
                />
              </div>

              <figcaption className="mt-6">
                <h3 className="font-display text-2xl sm:text-[1.6rem] text-cream-50 leading-tight">
                  {c.name}
                </h3>
                <p className="mt-3 mx-auto max-w-xs text-sm leading-relaxed text-cream-50/65">
                  {c.description}
                </p>

                <details className="group/details mt-5 text-left mx-auto max-w-xs">
                  <summary className="cursor-pointer list-none flex items-center justify-center gap-2 text-[0.65rem] uppercase tracking-[0.28em] text-mustard/75 hover:text-mustard transition-colors">
                    <span>Ingredients &amp; allergens</span>
                    <span className="transition-transform group-open/details:rotate-90">
                      ›
                    </span>
                  </summary>
                  <div className="mt-4 text-xs leading-relaxed text-cream-50/70">
                    {c.ingredients}
                  </div>
                  <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                    {c.allergens.map((a) => (
                      <span
                        key={a}
                        className="inline-flex items-center gap-1.5 rounded-full border border-cream-50/20 px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.18em] text-cream-50/70"
                      >
                        {allergenIcon(a)}
                        {a}
                      </span>
                    ))}
                  </div>
                </details>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}
