import Image from "next/image";
import { BarChart3, FileText, Lock } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Container } from "@/components/layout/container";
import { PARTNERS } from "@/lib/constants/partners";
import { DISPLAY_SM, DISPLAY_XL } from "./home-fonts";
import { Reveal } from "./reveal";

const assurances: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Lock,
    title: "Verified and reviewed",
    description:
      "Datasets are sourced from NSPHCDA, the Ministry of Health, and verified partners, then reviewed before publication.",
  },
  {
    icon: FileText,
    title: "Open licences",
    description:
      "Health datasets are published under open licences (CC BY, OGL) for reuse in research and planning.",
  },
  {
    icon: BarChart3,
    title: "Regularly updated",
    description:
      "Surveillance, facility, and indicator datasets are refreshed so the catalogue reflects the latest information.",
  },
];

/**
 * Layout family: assurance statement over a logo wall. The three assurances
 * are plain text columns under a hairline. The wall shows logos only: no
 * labels, no roles. Roles live on the About page.
 */
export function TrustAndPartners() {
  return (
    <section className="relative isolate overflow-hidden bg-muted/50 py-20 sm:py-28">
      <div
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(27,94,32,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(27,94,32,0.06)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
        aria-hidden
      />
      <Container size="wide" className="px-4 sm:px-6 lg:px-8">
        <Reveal>
          <h2
            className={`${DISPLAY_XL} max-w-3xl text-3xl font-bold sm:text-4xl lg:text-5xl`}
          >
            Data you can rely on, open to everyone
          </h2>
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-12 grid grid-cols-1 gap-8 border-t pt-8 md:grid-cols-3 md:gap-10">
            {assurances.map((item) => (
              <div key={item.title}>
                <item.icon className="size-6 text-primary" aria-hidden />
                <h3 className={`${DISPLAY_SM} mt-4 text-xl font-semibold`}>
                  {item.title}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={150} className="mt-16">
          <h3 className={`${DISPLAY_SM} text-xl font-semibold`}>
            Built with our partners
          </h3>
          <ul className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border bg-border sm:grid-cols-3 lg:grid-cols-6">
            {PARTNERS.map((partner) => {
              const logo = partner.logo;
              if (!logo) return null;
              const wide = logo.width / logo.height >= 2;
              const image = (
                <Image
                  src={logo.src}
                  alt={partner.name}
                  width={logo.width}
                  height={logo.height}
                  unoptimized={logo.src.endsWith(".svg")}
                  className={
                    wide
                      ? "h-auto max-h-10 w-full max-w-[8.5rem] object-contain"
                      : "size-14 object-contain"
                  }
                />
              );
              return (
                <li
                  key={partner.name}
                  className="flex h-28 items-center justify-center bg-card px-4"
                >
                  {logo.onDark ? (
                    <span className="rounded-md bg-slate-900 px-3 py-2">{image}</span>
                  ) : (
                    image
                  )}
                </li>
              );
            })}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
