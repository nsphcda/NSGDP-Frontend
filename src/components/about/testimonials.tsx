"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/home/reveal";
import { DISPLAY_SM, DISPLAY_XL } from "@/components/home/home-fonts";
import { TESTIMONIALS } from "@/lib/constants/testimonials";

/**
 * Large-quote carousel. Renders nothing while TESTIMONIALS is empty, so the
 * page never shows placeholder or invented quotes. One quote at a time, set as
 * plain large type with attribution underneath.
 */
export function Testimonials() {
  const [slide, setSlide] = useState(0);
  if (TESTIMONIALS.length === 0) return null;

  const current = TESTIMONIALS[slide];
  const prev = () => setSlide((s) => (s === 0 ? TESTIMONIALS.length - 1 : s - 1));
  const next = () => setSlide((s) => (s === TESTIMONIALS.length - 1 ? 0 : s + 1));

  return (
    <section className="py-20 sm:py-28">
      <Container size="wide" className="px-4 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className={`${DISPLAY_XL} text-3xl font-bold sm:text-4xl lg:text-5xl`}>
            What users say
          </h2>
          <figure className="mt-12 max-w-4xl">
            <blockquote
              className={`${DISPLAY_SM} text-2xl font-medium leading-snug sm:text-3xl lg:text-4xl`}
            >
              &ldquo;{current.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-6 text-base">
              <span className="font-semibold">{current.name}</span>
              <span className="text-muted-foreground">, {current.role}</span>
            </figcaption>
          </figure>
          {TESTIMONIALS.length > 1 ? (
            <div className="mt-8 flex items-center gap-3">
              <button
                type="button"
                onClick={prev}
                aria-label="Previous testimonial"
                className="flex size-11 items-center justify-center rounded-lg border hover:bg-muted"
              >
                <ChevronLeft className="size-4" aria-hidden />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next testimonial"
                className="flex size-11 items-center justify-center rounded-lg border hover:bg-muted"
              >
                <ChevronRight className="size-4" aria-hidden />
              </button>
              <span className="ml-2 text-sm tabular-nums text-muted-foreground">
                {slide + 1} / {TESTIMONIALS.length}
              </span>
            </div>
          ) : null}
        </Reveal>
      </Container>
    </section>
  );
}
