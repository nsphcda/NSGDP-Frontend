import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { DISPLAY_XL } from "./home-fonts";
import { Reveal } from "./reveal";

/** Last call to action. Same labels as the hero: one label per intent. */
export function ClosingCta() {
  return (
    <section className="py-20 sm:py-28">
      <Container size="wide" className="px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex flex-col gap-8 rounded-2xl bg-[#1B5E20] px-7 py-12 text-white sm:px-12 sm:py-14 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <h2
                className={`${DISPLAY_XL} text-3xl font-bold sm:text-4xl lg:text-5xl`}
              >
                Ready to explore health data?
              </h2>
              <p className="mt-4 text-base leading-relaxed text-white/85 sm:text-lg">
                Browse datasets, open interactive maps, or contribute partner data for
                review and publication.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <Link href="/dataportal">
                <Button
                  size="lg"
                  variant="onDarkSolid"
                  className="h-12 w-full px-7 text-base text-[#0D3B14] sm:w-auto"
                >
                  Browse repository
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
              <Link href="/partner-data">
                <Button
                  size="lg"
                  variant="onDark"
                  className="h-12 w-full px-7 text-base sm:w-auto"
                >
                  Contribute data
                </Button>
              </Link>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
