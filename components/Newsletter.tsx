"use client";

import { Reveal } from "./Reveal";
import { SubscribeForm } from "./SubscribeForm";

export function Newsletter() {
  return (
    <section
      id="newsletter"
      className="relative isolate overflow-hidden bg-forest text-cream-50"
    >
      {/* soft decorative glows to make the band feel warm & special */}
      <div
        aria-hidden
        className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-mustard/15 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -bottom-28 -right-16 h-80 w-80 rounded-full bg-mustard/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8 py-20 sm:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left: the pitch */}
        <div>
          <Reveal>
            <span className="inline-flex items-center gap-3 text-mustard uppercase tracking-[0.32em] text-xs">
              <span className="w-8 h-px bg-mustard" />
              Join the table
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-5 font-display text-4xl sm:text-5xl leading-[1.05]">
              A seasonal recipe,
              <span className="block italic text-mustard">
                on the house.
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-md text-cream-50/80 leading-relaxed">
              Leave your details and we&apos;ll send you one of our seasonal
              recipes to bake at home. You&apos;ll also be first to hear about
              holiday menus and subscriber-only offers — and we&apos;ll send a
              little birthday treat when your day comes around.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-4 text-xs uppercase tracking-[0.18em] text-cream-50/45">
              No spam — pastry only.
            </p>
          </Reveal>
        </div>

        {/* Right: the form card */}
        <Reveal delay={0.1}>
          <div className="rounded-[1.6rem] bg-cream-50/[0.06] border border-cream-50/15 p-6 sm:p-8 backdrop-blur-sm">
            <SubscribeForm tone="dark" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
