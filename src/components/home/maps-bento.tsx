import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Hospital, MapPin, Users } from "lucide-react";
import { Container } from "@/components/layout/container";
import { BRAND } from "@/lib/constants/brand";
import { DISPLAY_SM, DISPLAY_XL } from "./home-fonts";
import { Reveal } from "./reveal";

/**
 * Layout family: bento. Exactly three cells for three tools: one large tile
 * over the illustration, two smaller tinted tiles. Corner radius is 16px for
 * every tile on this page.
 */
export function MapsBento() {
  return (
    <section className="bg-muted/50 py-20 sm:py-28">
      <Container size="wide" className="px-4 sm:px-6 lg:px-8">
        <Reveal>
          <h2
            className={`${DISPLAY_XL} max-w-2xl text-3xl font-bold sm:text-4xl lg:text-5xl`}
          >
            Maps and facilities
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
            Open GIS tools for facilities, population, and settlement access.
          </p>
        </Reveal>

        <Reveal delay={100} className="mt-12">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:grid-rows-2">
            <Link
              href="/population-map"
              className="group relative isolate flex min-h-[24rem] flex-col justify-end overflow-hidden rounded-2xl p-7 text-white sm:p-9 lg:col-span-2 lg:row-span-2"
            >
              <Image
                src={BRAND.heroImagePath}
                alt=""
                fill
                sizes="(min-width: 1024px) 66vw, 100vw"
                className="-z-20 object-cover object-[18%_70%] transition-transform duration-700 group-hover:scale-[1.03]"
                aria-hidden
              />
              <div
                className="absolute inset-0 -z-10 bg-gradient-to-t from-[#0D3B14] via-[#0D3B14]/75 to-[#0D3B14]/30"
                aria-hidden
              />
              <span className="flex size-12 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
                <Users className="size-5" aria-hidden />
              </span>
              <h3
                className={`${DISPLAY_XL} mt-5 text-3xl font-bold sm:text-4xl`}
              >
                Population and facility map
              </h3>
              <p className="mt-3 max-w-md text-base leading-relaxed text-white/85">
                Compare population need with facility distribution at LGA level.
              </p>
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-teal">
                Open map
                <ArrowUpRight
                  className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden
                />
              </span>
            </Link>

            <Link
              href="/facilities"
              className="group flex min-h-[11.5rem] flex-col justify-between rounded-2xl bg-accent p-7 text-accent-foreground transition-colors hover:bg-accent/70"
            >
              <span className="flex items-start justify-between">
                <span className="flex size-11 items-center justify-center rounded-xl bg-white/70 dark:bg-black/20">
                  <Hospital className="size-5" aria-hidden />
                </span>
                <ArrowUpRight
                  className="size-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden
                />
              </span>
              <span>
                <h3 className={`${DISPLAY_SM} text-2xl font-bold`}>
                  Facility finder
                </h3>
                <p className="mt-1.5 text-[15px] leading-relaxed opacity-85">
                  Search primary health facilities statewide and open them on the map.
                </p>
              </span>
            </Link>

            <Link
              href="/settlements"
              className="group flex min-h-[11.5rem] flex-col justify-between rounded-2xl bg-secondary p-7 text-secondary-foreground transition-colors hover:bg-secondary/70"
            >
              <span className="flex items-start justify-between">
                <span className="flex size-11 items-center justify-center rounded-xl bg-white/70 dark:bg-black/20">
                  <MapPin className="size-5" aria-hidden />
                </span>
                <ArrowUpRight
                  className="size-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden
                />
              </span>
              <span>
                <h3 className={`${DISPLAY_SM} text-2xl font-bold`}>
                  Settlement access map
                </h3>
                <p className="mt-1.5 text-[15px] leading-relaxed opacity-85">
                  See settlements relative to nearby health facilities.
                </p>
              </span>
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
