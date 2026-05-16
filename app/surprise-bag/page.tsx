import type { Metadata } from "next";
import Image from "next/image";
import { Apple, Smartphone, Leaf, Clock, Tag, ShoppingBag } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { SubPageHeader } from "@/components/SubPageHeader";
import { AlpineSilhouette } from "@/components/AlpineBackground";

export const metadata: Metadata = {
  title: "Surprise Bag · Edelweiss Pastry Shop",
  description:
    "Save delicious pastries, fight food waste — reserve our Surprise Bag through the Too Good To Go app. A mystery selection of the day's bakes at a fraction of the price.",
};

const steps = [
  {
    icon: <Smartphone className="h-5 w-5" />,
    title: "Download the app",
    body: "Get Too Good To Go on iOS or Android — free, takes a minute.",
  },
  {
    icon: <ShoppingBag className="h-5 w-5" />,
    title: "Reserve your bag",
    body: "Find Edelweiss Pastry Shop in the app and reserve one of our Surprise Bags.",
  },
  {
    icon: <Clock className="h-5 w-5" />,
    title: "Pick it up at the bakery",
    body: "Swing by during your assigned window and we will hand you a freshly packed bag.",
  },
];

const perks = [
  {
    icon: <Leaf className="h-5 w-5" />,
    title: "Zero waste",
    body: "Every Surprise Bag rescues fresh pastries that would otherwise not be sold by the end of the day.",
  },
  {
    icon: <Tag className="h-5 w-5" />,
    title: "Up to 1/3 of the price",
    body: "An assortment worth more than what you pay for it — a true Swiss bargain.",
  },
  {
    icon: <ShoppingBag className="h-5 w-5" />,
    title: "Always a surprise",
    body: "What ends up in the bag depends on the bake of the day. That is half the fun.",
  },
];

export default function SurpriseBagPage() {
  return (
    <main className="min-h-screen bg-cream-50">
      <Navbar />

      <SubPageHeader
        eyebrow="Surprise Bag"
        title={
          <>
            Save delicious pastries,
            <span className="block italic text-forest">
              fight food waste.
            </span>
          </>
        }
        description="We have partnered with Too Good To Go. Every day, our remaining pastries get packed into a Surprise Bag and offered through the app at a fraction of their original price. A small act of kindness that lets nothing go to waste."
      />

      <section className="relative isolate bg-cream-50 overflow-hidden">
        <AlpineSilhouette
          tone="cream"
          className="absolute inset-x-0 top-0 w-full h-40 opacity-60 -translate-y-1/4"
        />

        <div className="mx-auto max-w-7xl px-5 sm:px-8 pb-24 sm:pb-32 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Reveal>
              <div className="relative aspect-[5/4] w-full overflow-hidden rounded-[2rem] shadow-card">
                <Image
                  src="/images/heritage/bakery-storefront.jpg"
                  alt="Pastries waiting at Edelweiss"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-cocoa/55 via-cocoa/0 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8 sm:left-12 sm:bottom-12 text-cream-50 max-w-xl">
                  <div className="text-[0.7rem] uppercase tracking-[0.3em] opacity-85">
                    In partnership with Too Good To Go
                  </div>
                  <div className="mt-3 font-display text-3xl sm:text-5xl leading-[1.05]">
                    Yesterday&apos;s bake, tomorrow&apos;s smile.
                  </div>
                </div>
              </div>
            </Reveal>

            <div className="mt-14">
              <Reveal>
                <h2 className="font-display text-3xl sm:text-4xl text-cocoa">
                  How it works
                </h2>
              </Reveal>
              <ul className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
                {steps.map((s, i) => (
                  <Reveal key={s.title} delay={i * 0.06} as="li">
                    <div className="h-full rounded-2xl bg-cream-100 p-6 border border-cocoa/5">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-forest text-cream-50">
                        {s.icon}
                      </div>
                      <div className="mt-5 text-[0.7rem] uppercase tracking-[0.24em] text-cocoa/55">
                        Step {String(i + 1).padStart(2, "0")}
                      </div>
                      <h3 className="mt-1 font-display text-2xl text-cocoa">
                        {s.title}
                      </h3>
                      <p className="mt-2 text-sm text-cocoa/70 leading-relaxed">
                        {s.body}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>

          <aside className="lg:col-span-5">
            <Reveal>
              <div className="rounded-[1.6rem] bg-forest text-cream-50 p-8 sm:p-10 shadow-card">
                <div className="text-[0.7rem] uppercase tracking-[0.3em] text-mustard">
                  Download Too Good To Go
                </div>
                <h2 className="mt-4 font-display text-3xl sm:text-4xl leading-tight">
                  Free on iOS &amp; Android
                </h2>
                <p className="mt-4 text-cream-50/80 text-sm leading-relaxed">
                  Search for <strong>Edelweiss Pastry Shop</strong> inside the
                  app, reserve a Surprise Bag and we will see you at the
                  counter.
                </p>

                <div className="mt-7 space-y-3">
                  <a
                    href="https://apps.apple.com/app/too-good-to-go/id1046887200"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 rounded-2xl bg-cream-50 text-cocoa px-5 py-4 hover:bg-mustard transition-colors"
                  >
                    <Apple size={28} />
                    <div className="flex-1">
                      <div className="text-[0.65rem] uppercase tracking-[0.22em] text-cocoa/65">
                        Download on the
                      </div>
                      <div className="font-display text-xl leading-none mt-0.5">
                        App Store
                      </div>
                    </div>
                  </a>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.app.tgtg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 rounded-2xl bg-cream-50 text-cocoa px-5 py-4 hover:bg-mustard transition-colors"
                  >
                    <PlayBadge />
                    <div className="flex-1">
                      <div className="text-[0.65rem] uppercase tracking-[0.22em] text-cocoa/65">
                        Get it on
                      </div>
                      <div className="font-display text-xl leading-none mt-0.5">
                        Google Play
                      </div>
                    </div>
                  </a>
                </div>

                <div className="mt-8 border-t border-cream-50/15 pt-6 text-xs text-cream-50/65 leading-relaxed">
                  Surprise Bag availability depends on the day&apos;s bake.
                  Reserve early — they sell out quickly.
                </div>
              </div>
            </Reveal>

            <ul className="mt-8 space-y-4">
              {perks.map((p, i) => (
                <Reveal key={p.title} delay={i * 0.05} as="li">
                  <div className="flex items-start gap-4 rounded-2xl bg-cream-100 p-5 border border-cocoa/5">
                    <span className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-full bg-rust text-cream-50">
                      {p.icon}
                    </span>
                    <div>
                      <h3 className="font-display text-xl text-cocoa">
                        {p.title}
                      </h3>
                      <p className="mt-1 text-sm text-cocoa/70 leading-relaxed">
                        {p.body}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function PlayBadge() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden>
      <path
        fill="currentColor"
        d="M3.6 1.4c-.4.3-.6.8-.6 1.5v18.2c0 .7.2 1.2.6 1.5l10-9.3v-.5l-10-9.4Zm13.9 12.3l-2.6-2.4 2.6-2.5 3.2 1.8c1 .6 1 1.6 0 2.2l-3.2 1.9Zm-3.5-3.3l-9.5-8.9 11.4 6.5-1.9 2.4ZM4.5 22.5l9.5-8.9 1.9 2.4-11.4 6.5Z"
      />
    </svg>
  );
}
