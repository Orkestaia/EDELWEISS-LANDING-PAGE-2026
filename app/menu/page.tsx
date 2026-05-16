import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { SubPageHeader } from "@/components/SubPageHeader";
import { EdelweissMark } from "@/components/EdelweissMark";
import { menuSections } from "@/lib/menu";

export const metadata: Metadata = {
  title: "Menu · Edelweiss Pastry Shop",
  description:
    "The full Edelweiss menu with prices — breakfast pastries, breads, desserts and cookies, baked daily in Biddeford, Maine.",
};

export default function MenuPage() {
  return (
    <main className="min-h-screen bg-cream-50">
      <Navbar />

      <SubPageHeader
        eyebrow="Full menu"
        title={
          <>
            Everything we bake,
            <span className="block italic text-forest">with prices.</span>
          </>
        }
        description="Available in store and online for pick-up Tuesday through Sunday. Some items rotate seasonally — call us at 207 770-6945 to check availability or to place a large order."
      />

      <section className="relative bg-cream-50 pb-24 sm:pb-32">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          {/* Decorative letterhead */}
          <Reveal>
            <div className="mx-auto max-w-3xl text-center pb-12 border-b border-cocoa/15">
              <div className="flex justify-center">
                <EdelweissMark size={56} />
              </div>
              <div className="mt-4 uppercase tracking-[0.4em] text-xs text-cocoa/55">
                Edelweiss Pastry Shop
              </div>
              <div className="mt-2 font-display italic text-5xl sm:text-6xl text-cocoa">
                Menu
              </div>
              <div className="mx-auto mt-3 h-px w-16 bg-mustard" />
            </div>
          </Reveal>

          <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-20">
            {menuSections.map((section) => (
              <Reveal key={section.title}>
                <div>
                  <div className="flex items-center gap-3 text-mustard uppercase tracking-[0.3em] text-[0.7rem] mb-6">
                    <span className="w-6 h-px bg-mustard" />
                    {section.title}
                    <span className="flex-1 h-px bg-mustard/40" />
                  </div>
                  <ul className="divide-y divide-cocoa/10">
                    {section.items.map((item) => (
                      <li
                        key={item.name}
                        className="py-5 grid grid-cols-[1fr_auto] gap-x-6 gap-y-1 items-baseline"
                      >
                        <h3 className="font-medium uppercase tracking-[0.06em] text-cocoa text-sm sm:text-base">
                          {item.name}
                          {item.tag && (
                            <span className="ml-2 text-[0.7rem] italic text-mustard tracking-normal normal-case">
                              {item.tag}
                            </span>
                          )}
                        </h3>
                        <span className="font-display text-cocoa/85 text-xl tabular-nums">
                          {item.price}
                        </span>
                        {item.description && (
                          <p className="col-span-2 text-sm italic text-cocoa/65 leading-relaxed">
                            {item.description}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>

          {/* en Guete */}
          <Reveal>
            <div className="mt-24 text-center text-cocoa">
              <p className="font-display italic text-3xl text-mustard">
                en Guete!
              </p>
              <p className="mt-3 text-sm text-cocoa/65">
                edelweisspastryshop.ch · @edelweissmaine ·{" "}
                <a
                  href="tel:+12077706945"
                  className="underline underline-offset-4 hover:text-rust"
                >
                  Call us at 207 770-6945
                </a>
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div className="mt-16 flex flex-wrap justify-center gap-4">
              <a
                href="#order"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-cocoa text-cream-50 px-7 py-3.5 text-sm uppercase tracking-[0.22em] hover:bg-rust transition-colors"
              >
                Order for pick-up
                <ArrowUpRight size={15} />
              </a>
              <Link
                href="/chocolates"
                className="inline-flex items-center gap-2 rounded-full border border-cocoa/25 text-cocoa px-7 py-3.5 text-sm uppercase tracking-[0.22em] hover:bg-cocoa hover:text-cream-50 transition-colors"
              >
                Discover our chocolates
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  );
}
