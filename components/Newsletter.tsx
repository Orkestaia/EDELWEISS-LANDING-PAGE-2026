"use client";

import { ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";

export function Newsletter() {
  return (
    <section id="newsletter" className="relative bg-forest text-cream-50">
      <div className="mx-auto max-w-5xl px-5 sm:px-8 py-20 sm:py-24 text-center">
        <Reveal>
          <span className="inline-flex items-center gap-3 text-mustard uppercase tracking-[0.32em] text-xs">
            <span className="w-8 h-px bg-mustard" />
            Newsletter
          </span>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-5 font-display text-4xl sm:text-5xl leading-[1.05]">
            Your first Edelweiss recipe,
            <span className="block italic text-mustard">
              straight to your inbox.
            </span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-5 max-w-xl mx-auto text-cream-50/80">
            Occasional notes on seasonal pastries, holiday menus and small
            offers reserved for subscribers. No spam — pastry only.
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="mt-9 max-w-md mx-auto flex flex-col sm:flex-row gap-3"
          >
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              placeholder="you@inbox.com"
              className="flex-1 rounded-full bg-cream-50/10 border border-cream-50/25 px-5 py-3.5 text-sm text-cream-50 placeholder:text-cream-50/45 focus:outline-none focus:border-mustard focus:bg-cream-50/15 transition-colors"
            />
            <button
              type="submit"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-mustard text-cocoa px-6 py-3.5 text-sm uppercase tracking-[0.2em] hover:bg-cream-50 transition-colors"
            >
              Subscribe
              <ArrowRight
                size={15}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
