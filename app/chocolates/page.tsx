import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Leaf, GlassWater, Sparkles } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { SubPageHeader } from "@/components/SubPageHeader";
import { AlpineSilhouette } from "@/components/AlpineBackground";
import {
  chocolates,
  chocolateGroups,
  chocolateGroupDescriptions,
  type ChocolateGroup,
} from "@/lib/chocolates";

export const metadata: Metadata = {
  title: "Chocolates · Edelweiss Pastry Shop",
  description:
    "Hand-made Swiss truffles and bonbons crafted with premium Felchlin chocolate. A seasonal collection that rotates with the year.",
};

const allergenIcon = (a: string) => {
  if (a === "Alcohol") return <GlassWater size={11} />;
  if (a === "Tree nuts" || a === "Coconut") return <Leaf size={11} />;
  return <Sparkles size={11} />;
};

export default function ChocolatesPage() {
  return (
    <main className="min-h-screen bg-cream-50">
      <Navbar />
      <SubPageHeader
        eyebrow="Chocolates"
        title={
          <>
            Hand-rolled in Maine,
            <span className="block italic text-forest">
              with Swiss patience.
            </span>
          </>
        }
        description="Every truffle and bonbon is made by hand in small batches using premium Felchlin chocolate from Switzerland. Our seasonal collection rotates throughout the year — the list below is what is on our shelves right now."
      />

      {/* Hero strip */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal>
            <div className="relative aspect-[16/7] w-full overflow-hidden rounded-[2rem] shadow-card">
              <Image
                src="/images/chocolates/hero-tray.jpg"
                alt="Tray of hand-made Edelweiss chocolates"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 80vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-cocoa/60 via-cocoa/10 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 sm:left-12 sm:bottom-12 text-cream-50">
                <div className="text-[0.7rem] uppercase tracking-[0.3em] opacity-85">
                  Premium Felchlin chocolate · made by hand
                </div>
                <div className="mt-3 font-display text-3xl sm:text-5xl max-w-2xl leading-[1.05]">
                  Three truffles. Ten bonbons. One quiet obsession.
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Groups */}
      <section className="relative isolate bg-cream-50 overflow-hidden">
        <AlpineSilhouette
          tone="cream"
          className="absolute inset-x-0 bottom-0 w-full h-44 opacity-70"
        />
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-24 sm:py-32 space-y-24">
          {chocolateGroups.map((group) => (
            <ChocolateGroupSection key={group} group={group} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-cocoa text-cream-50">
        <div className="mx-auto max-w-5xl px-5 sm:px-8 py-20 sm:py-24 text-center">
          <Reveal>
            <span className="inline-flex items-center gap-3 text-mustard uppercase tracking-[0.32em] text-xs">
              <span className="w-8 h-px bg-mustard" />
              Reserve a box
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-5 font-display text-4xl sm:text-5xl leading-[1.05]">
              Bring home a curated box
              <span className="block italic text-mustard">
                of our latest collection.
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-xl mx-auto text-cream-50/80">
              Order online for in-store pick-up and we will pack a fresh
              assortment of the week&apos;s rotation.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/#shop"
                className="inline-flex items-center gap-2 rounded-full bg-mustard text-cocoa px-7 py-3.5 text-sm uppercase tracking-[0.22em] hover:bg-cream-50 transition-colors"
              >
                Order chocolates
                <ArrowUpRight size={15} />
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
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-6 border-b border-cocoa/15">
        <Reveal>
          <h2 className="font-display text-3xl sm:text-4xl text-cocoa">
            {group}
          </h2>
        </Reveal>
        <Reveal delay={0.05} className="max-w-md">
          <p className="text-sm text-cocoa/65 leading-relaxed">
            {chocolateGroupDescriptions[group]}
          </p>
        </Reveal>
      </div>

      <ul className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {items.map((c, i) => (
          <Reveal key={c.slug} delay={(i % 3) * 0.05} as="li">
            <article className="group h-full rounded-[1.4rem] bg-cream-100 overflow-hidden shadow-soft hover:shadow-card transition-shadow">
              <div className="relative aspect-[5/4] w-full overflow-hidden bg-cocoa">
                <Image
                  src={c.image}
                  alt={c.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
                />
              </div>
              <div className="p-6 sm:p-7">
                <h3 className="font-display text-2xl text-cocoa leading-tight">
                  {c.name}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-cocoa/75">
                  {c.description}
                </p>
                <div className="mt-5 text-[0.7rem] uppercase tracking-[0.22em] text-cocoa/55">
                  Ingredients
                </div>
                <p className="mt-1 text-xs text-cocoa/70 leading-relaxed">
                  {c.ingredients}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {c.allergens.map((a) => (
                    <span
                      key={a}
                      className="inline-flex items-center gap-1.5 rounded-full bg-cream-50 border border-cocoa/10 px-2.5 py-1 text-[0.65rem] uppercase tracking-[0.18em] text-cocoa/65"
                    >
                      {allergenIcon(a)}
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}
