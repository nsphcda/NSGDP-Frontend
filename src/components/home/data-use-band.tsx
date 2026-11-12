import { Activity, Hospital, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Container } from "@/components/layout/container";
import { DISPLAY_XL } from "./home-fonts";
import { Reveal } from "./reveal";

const uses: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Activity,
    title: "Disease surveillance",
    description:
      "Monitor malaria, meningitis, cholera, and other notifiable diseases. Identify hotspots and support timely response.",
  },
  {
    icon: Hospital,
    title: "Facility planning",
    description:
      "Map facility distribution against population need to guide infrastructure and referral network design.",
  },
  {
    icon: Users,
    title: "Population health",
    description:
      "Combine demographic and outcome data to understand burden by LGA and support resource allocation.",
  },
];

/**
 * Layout family: dark brand band. One full-bleed section in the deep brand
 * green, with a faint grid texture. Columns are unequal on purpose: the first
 * use case is the one the portal was built around, so it gets the most room.
 */
export function DataUseBand() {
  return (
    <section className="relative isolate overflow-hidden bg-[#0D3B14] py-20 text-white sm:py-28">
      <div
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_top_left,black,transparent_75%)]"
        aria-hidden
      />
      <Container size="wide" className="px-4 sm:px-6 lg:px-8">
        <Reveal>
          <h2
            className={`${DISPLAY_XL} max-w-3xl text-3xl font-bold sm:text-4xl lg:text-5xl`}
          >
            How the data is used
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/75">
            How Niger State uses geospatial health data in practice.
          </p>
        </Reveal>

        <Reveal delay={100} className="mt-14">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.5fr_1fr_1fr] lg:gap-0">
            {uses.map((use, i) => (
              <div
                key={use.title}
                className={`border-t border-white/20 pt-8 lg:border-l lg:border-t-0 lg:pt-0 ${
                  i === 0 ? "lg:border-l-0 lg:pr-12" : "lg:px-10"
                }`}
              >
                <use.icon className="size-7 text-teal" aria-hidden />
                <h3
                  className={`${DISPLAY_XL} mt-5 font-semibold ${
                    i === 0 ? "text-3xl sm:text-4xl" : "text-2xl"
                  }`}
                >
                  {use.title}
                </h3>
                <p
                  className={`mt-3 max-w-md leading-relaxed text-white/75 ${
                    i === 0 ? "text-lg" : "text-[15px]"
                  }`}
                >
                  {use.description}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
