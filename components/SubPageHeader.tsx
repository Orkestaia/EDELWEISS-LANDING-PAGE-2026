"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Reveal } from "./Reveal";

type Props = {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
};

export function SubPageHeader({ eyebrow, title, description }: Props) {
  return (
    <section className="relative isolate bg-cream-50 paper pt-32 sm:pt-40 pb-14 sm:pb-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-cocoa/60 hover:text-rust text-xs uppercase tracking-[0.24em] transition-colors"
          >
            <ArrowLeft size={14} />
            Back to home
          </Link>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mt-8 inline-flex items-center gap-3 text-rust uppercase tracking-[0.32em] text-xs">
            <span className="w-8 h-px bg-rust" />
            {eyebrow}
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 className="mt-6 font-display text-5xl sm:text-6xl lg:text-7xl text-cocoa leading-[1.04] max-w-4xl">
            {title}
          </h1>
        </Reveal>
        {description && (
          <Reveal delay={0.15}>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-cocoa/75">
              {description}
            </p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
