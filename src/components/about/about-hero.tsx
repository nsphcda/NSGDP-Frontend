import { Container } from "@/components/layout/container";
import { DISPLAY_XL } from "@/components/home/home-fonts";

/**
 * About hero: deep brand green with a soft glow and the same faint grid used on
 * the dark bands. The illustration is reserved for the home page. Shorter than
 * the home hero, with the live statistics strip overlapping its bottom edge
 * (rendered by the page).
 */
export function AboutHero() {
  return (
    <section className="relative isolate overflow-hidden bg-[#0D3B14] text-white">
      {/* Soft lighter-green glow behind the copy's right side. */}
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_90%_at_85%_10%,rgba(46,125,50,0.55),transparent_65%)]"
        aria-hidden
      />
      <div
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:linear-gradient(to_bottom,black,transparent_90%)]"
        aria-hidden
      />

      <Container
        size="wide"
        className="flex min-h-[min(56dvh,480px)] items-center px-4 pb-28 pt-16 sm:px-6 sm:pt-20 lg:px-8"
      >
        <div className="max-w-2xl">
          <p className="home-rise text-sm font-semibold uppercase tracking-widest text-teal">
            About the portal
          </p>
          <h1
            className={`${DISPLAY_XL} home-rise home-rise-1 mt-4 text-4xl font-bold [text-shadow:0_2px_28px_rgba(0,0,0,0.35)] sm:text-5xl lg:text-6xl`}
          >
            NSPHCDA Data Portal
          </h1>
          <p className="home-rise home-rise-2 mt-5 max-w-xl text-base leading-relaxed text-white/90 [text-shadow:0_1px_20px_rgba(0,0,0,0.4)] sm:text-lg">
            Verified, map-ready health data for planners, surveillance officers, and
            researchers across Niger State.
          </p>
        </div>
      </Container>
    </section>
  );
}
