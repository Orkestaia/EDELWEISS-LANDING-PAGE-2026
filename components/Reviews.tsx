"use client";

import { Star } from "lucide-react";
import { reviews, type Review } from "@/lib/reviews";
import { Reveal } from "./Reveal";

function ReviewCard({ review }: { review: Review }) {
  return (
    <figure className="flex w-[20rem] sm:w-[24rem] shrink-0 flex-col justify-between rounded-2xl bg-cream-50 border border-cocoa/10 shadow-soft px-7 py-6">
      <div>
        <div className="flex items-center gap-1 text-mustard">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={15}
              className={
                i < review.rating ? "fill-mustard text-mustard" : "text-cocoa/20"
              }
            />
          ))}
        </div>
        <blockquote className="mt-4 text-cocoa/80 leading-relaxed text-[0.95rem]">
          &ldquo;{review.text}&rdquo;
        </blockquote>
      </div>

      <figcaption className="mt-6 flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-forest/10 text-forest font-display text-sm">
          {review.initials}
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-cocoa truncate">
              {review.name}
            </span>
            {review.localGuide && (
              <span className="shrink-0 rounded-full bg-forest/10 px-2 py-0.5 text-[0.6rem] uppercase tracking-[0.12em] text-forest">
                Local Guide
              </span>
            )}
          </div>
          <div className="mt-0.5 flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.18em] text-cocoa/45">
            <span>via Google</span>
            {review.date && <span aria-hidden>·</span>}
            {review.date && <span className="tracking-normal normal-case">{review.date}</span>}
          </div>
        </div>
      </figcaption>
    </figure>
  );
}

export function Reviews() {
  // Duplicamos la lista para que el bucle del marquee sea infinito y sin saltos.
  const loop = [...reviews, ...reviews];

  return (
    <section
      id="reviews"
      aria-label="What our guests say"
      className="relative isolate bg-cream-100 paper py-20 sm:py-28 overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="text-center">
          <span className="inline-flex items-center gap-3 text-forest uppercase tracking-[0.32em] text-xs">
            <span className="w-8 h-px bg-forest" />
            Loved in Biddeford
            <span className="w-8 h-px bg-forest" />
          </span>
          <h2 className="mt-6 font-display text-4xl sm:text-5xl text-cocoa leading-[1.05]">
            What our guests
            <span className="italic text-forest"> are saying.</span>
          </h2>
        </Reveal>
      </div>

      {/* Marquee */}
      <div className="group relative mt-14">
        {/* Edge fades into the background */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 sm:w-32 bg-gradient-to-r from-cream-100 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 sm:w-32 bg-gradient-to-l from-cream-100 to-transparent" />

        <div className="flex w-max gap-5 animate-marquee group-hover:[animation-play-state:paused]">
          {loop.map((review, i) => (
            <ReviewCard key={i} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
}
