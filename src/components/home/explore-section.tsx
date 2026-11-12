import Link from "next/link";
import { ArrowRight, BarChart3, Database, Map } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Container } from "@/components/layout/container";
import { DISPLAY_SM, DISPLAY_XL } from "./home-fonts";
import { Reveal } from "./reveal";

const ways: {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  well: string;
}[] = [
  {
    icon: Database,
    title: "Browse data",
    description:
      "Verified health datasets from NSPHCDA and partners across all 25 LGAs: surveillance, facilities, and population.",
    href: "/dataportal",
    well: "bg-primary/10 text-primary",
  },
  {
    icon: Map,
    title: "Maps",
    description:
      "Visualise disease burden, facility locations, and LGA indicators. Filter by metric, period, and geography.",
    href: "/map",
    well: "bg-primary/10 text-primary",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description:
      "Track trends with KPIs, time-series charts, and LGA summaries for outbreaks and immunisation coverage.",
    href: "/analytics",
    well: "bg-primary/10 text-primary",
  },
];

/**
 * Layout family: sticky split. A short statement on the left, three large link
 * rows on the right. Rows share hairlines instead of sitting in cards.
 */
export function ExploreSection() {
  return (
    <section className="py-20 sm:py-28">
      <Container
        size="wide"
        className="grid grid-cols-1 gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:px-8"
      >
        <Reveal className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <h2
              className={`${DISPLAY_XL} text-3xl font-bold sm:text-4xl lg:text-5xl`}
            >
              Three ways into the data
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
              Start from the catalogue, open a map, or follow the trends across the state.
            </p>
          </div>
        </Reveal>

        <Reveal className="lg:col-span-7" delay={120}>
          <ul className="border-t">
            {ways.map((way) => (
              <li key={way.title} className="border-b">
                <Link
                  href={way.href}
                  className="group flex items-start gap-5 py-7 transition-colors hover:bg-muted/50 sm:px-4 lg:-mx-4"
                >
                  <span
                    className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${way.well}`}
                  >
                    <way.icon className="size-5" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className={`${DISPLAY_SM} block text-2xl font-semibold`}
                    >
                      {way.title}
                    </span>
                    <span className="mt-1.5 block max-w-xl text-[15px] leading-relaxed text-muted-foreground">
                      {way.description}
                    </span>
                  </span>
                  <ArrowRight
                    className="mt-3 size-5 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary"
                    aria-hidden
                  />
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
