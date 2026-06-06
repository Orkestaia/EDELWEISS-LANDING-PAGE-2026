"use client";

import { MapPin, Clock, Phone, Mail } from "lucide-react";
import { Reveal } from "./Reveal";
import { AlpineSilhouette } from "./AlpineBackground";

const hours = [
  ["Monday", "Closed"],
  ["Tuesday", "7am – 2pm"],
  ["Wednesday", "7am – 2pm"],
  ["Thursday", "7am – 2pm"],
  ["Friday", "7am – 2pm"],
  ["Saturday", "8am – 2pm"],
  ["Sunday", "8am – 2pm"],
];

export function Visit() {
  return (
    <section id="visit" className="relative isolate bg-cream-100 paper overflow-hidden">
      <AlpineSilhouette
        tone="cream"
        className="absolute inset-x-0 top-0 w-full h-56 opacity-80 -translate-y-1/3"
      />

      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-24 sm:py-32 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
        <div className="lg:col-span-6">
          <Reveal>
            <span className="inline-flex items-center gap-3 text-rust uppercase tracking-[0.32em] text-xs">
              <span className="w-8 h-px bg-rust" />
              Visit the bakery
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl text-cocoa leading-[1.05]">
              Come say
              <span className="italic text-forest"> grüezi.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 text-lg leading-relaxed text-cocoa/75 max-w-lg">
              You will find us in downtown Biddeford, just off Main Street —
              Maine&apos;s little corner of the Swiss Alps. The bench is
              always full of pastry, and we love seeing new faces.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <ul className="mt-10 space-y-5 text-cocoa">
              <li className="flex items-start gap-4">
                <span className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-full bg-forest text-cream-50">
                  <MapPin size={16} />
                </span>
                <div>
                  <div className="text-xs uppercase tracking-[0.22em] text-cocoa/55">
                    Bakery
                  </div>
                  <a
                    href="https://maps.google.com/?q=5+Alfred+Street+%23103+Biddeford+Maine+04005"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mt-0.5 hover:text-rust transition-colors"
                  >
                    <div className="font-display text-2xl">
                      5 Alfred Street #103
                    </div>
                    <div className="text-sm text-cocoa/70 mt-1">
                      Biddeford, Maine 04005 · United States
                    </div>
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-full bg-forest text-cream-50">
                  <Phone size={16} />
                </span>
                <div>
                  <div className="text-xs uppercase tracking-[0.22em] text-cocoa/55">
                    Phone
                  </div>
                  <a
                    href="tel:+12077706945"
                    className="font-display text-2xl mt-0.5 inline-block hover:text-rust transition-colors"
                  >
                    207 770-6945
                  </a>
                  <div className="text-sm text-cocoa/70 mt-1">
                    Tap to schedule large orders
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-full bg-forest text-cream-50">
                  <Mail size={16} />
                </span>
                <div>
                  <div className="text-xs uppercase tracking-[0.22em] text-cocoa/55">
                    Email
                  </div>
                  <a
                    href="mailto:info@edelweissconfections.com"
                    className="font-display text-xl sm:text-2xl mt-0.5 inline-block hover:text-rust transition-colors break-all"
                  >
                    info@edelweissconfections.com
                  </a>
                </div>
              </li>
            </ul>
          </Reveal>
        </div>

        <div className="lg:col-span-6">
          <Reveal>
            <div className="rounded-[2rem] bg-cream-50 p-8 sm:p-10 shadow-soft border border-cocoa/5">
              <div className="flex items-center gap-3 text-forest uppercase tracking-[0.3em] text-xs">
                <Clock size={14} />
                Bakery hours
              </div>
              <dl className="mt-6 divide-y divide-cocoa/10">
                {hours.map(([d, t]) => (
                  <div
                    key={d}
                    className="grid grid-cols-2 py-3.5 items-center"
                  >
                    <dt className="font-display text-xl text-cocoa">{d}</dt>
                    <dd
                      className={`text-right text-sm tracking-[0.18em] uppercase ${
                        t === "Closed" ? "text-rust" : "text-cocoa/75"
                      }`}
                    >
                      {t}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-6 text-sm text-cocoa/60">
                Closed Mondays. Hours may shift slightly around holidays — keep
                an eye on our Instagram for special bakes.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
