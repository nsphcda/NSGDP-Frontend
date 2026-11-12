import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Database, FileCheck, Flag, Lock, Map, Server, Shield } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/home/reveal";
import { DISPLAY_SM, DISPLAY_XL } from "@/components/home/home-fonts";
import { NIGER_STATE_LGAS } from "@/lib/constants/core";
import { PARTNERS } from "@/lib/constants/partners";

const wrap = "px-4 sm:px-6 lg:px-8";
const h2 = `${DISPLAY_XL} text-3xl font-bold sm:text-4xl lg:text-5xl`;

/* ------------------------------------------------------------------ overview */

/** Layout family: editorial split. A heading beside two paragraphs of body copy. */
export function Overview() {
  return (
    <section className="py-20 sm:py-28">
      <Container size="wide" className={`grid gap-10 lg:grid-cols-12 lg:gap-16 ${wrap}`}>
        <Reveal className="lg:col-span-5">
          <h2 className={h2}>One place for the state&apos;s health data</h2>
        </Reveal>
        <Reveal className="space-y-6 text-lg leading-relaxed text-muted-foreground lg:col-span-7" delay={100}>
          <p>
            The NSPHCDA Data Portal is a centralised geospatial health data system developed to
            strengthen data-driven decision-making across the state&apos;s 25 Local Government
            Areas. It brings together disease surveillance, health facility registry, and
            population data in one accessible platform.
          </p>
          <p>
            Funded by the Umbrella Fund and implemented by FACT Foundation in partnership with
            NSPHCDA and the Ministry of Health, the portal supports planners, surveillance
            officers, and researchers with verified, map-ready health datasets.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------ mission/vision */

/**
 * Layout family: statement pair. Two large statements split by one hairline,
 * set as type rather than boxed in cards.
 */
export function MissionVision() {
  const items = [
    {
      label: "Our Mission",
      text: "To provide timely, accurate, and geospatially-enabled health data that empowers Niger State government agencies, partners, and communities to improve health outcomes through evidence-based planning and responsive public health action.",
    },
    {
      label: "Our Vision",
      text: "A Niger State where every health decision, from facility placement to outbreak response, is informed by open, integrated, and actionable geospatial health intelligence accessible to all stakeholders.",
    },
  ];
  return (
    <section className="bg-muted/50 py-20 sm:py-28">
      <Container size="wide" className={wrap}>
        <Reveal>
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-0">
            {items.map((item, i) => (
              <div
                key={item.label}
                className={i === 0 ? "md:pr-14" : "border-t pt-12 md:border-l md:border-t-0 md:pl-14 md:pt-0"}
              >
                <h2 className="text-sm font-semibold text-primary">{item.label}</h2>
                <p className={`${DISPLAY_SM} mt-4 text-2xl font-medium leading-snug sm:text-3xl sm:leading-snug`}>
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------- what we do */

const whatWeDo: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Database,
    title: "Data Integration",
    description:
      "Aggregate health datasets from DHIS2, facility registries, and surveillance systems into a single geospatial portal. Standardise formats for seamless access.",
  },
  {
    icon: Map,
    title: "Geospatial Analytics",
    description:
      "Enable LGA-level mapping of disease burden, facility coverage, and population indicators. Support spatial analysis for targeted health interventions.",
  },
  {
    icon: Shield,
    title: "Secure Access",
    description:
      "Provide tiered access for public users, partners, and administrators. Protect sensitive data while maximising transparency for open health datasets.",
  },
];

/** Layout family: ruled table. Title on the left, description on the right, one rule per row. */
export function WhatWeDo() {
  return (
    <section className="py-20 sm:py-28">
      <Container size="wide" className={wrap}>
        <Reveal>
          <h2 className={h2}>What we do</h2>
        </Reveal>
        <Reveal delay={100} className="mt-12">
          <ul className="border-t">
            {whatWeDo.map((item) => (
              <li
                key={item.title}
                className="grid grid-cols-1 gap-4 border-b py-9 md:grid-cols-12 md:gap-10"
              >
                <div className="flex items-center gap-4 md:col-span-5">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <item.icon className="size-5" aria-hidden />
                  </span>
                  <h3 className={`${DISPLAY_SM} text-2xl font-semibold`}>{item.title}</h3>
                </div>
                <p className="text-[17px] leading-relaxed text-muted-foreground md:col-span-7">
                  {item.description}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ sovereignty */

const sovereignty: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Flag,
    title: "State Ownership",
    body: "The platform is owned by Niger State government. NSPHCDA holds full authority over all data published on this portal.",
  },
  {
    icon: Server,
    title: "Infrastructure Sovereignty",
    body: "Hosting, storage, and backups are managed within Nigeria, ensuring data residency and compliance with national data protection law.",
  },
  {
    icon: Lock,
    title: "Governance Authority",
    body: "NSPHCDA defines publication rules, access policies, validation standards, and data-sharing agreements. No dataset is published without state approval.",
  },
  {
    icon: FileCheck,
    title: "Data Quality & Trust",
    body: "Every dataset passes a structured multi-stage approval pipeline before publication, guaranteeing that only verified, quality-assured data reaches users.",
  },
];

/**
 * Layout family: dark brand band. Statement on the left, the four assurances on
 * the right in a 2x2 grid divided by hairlines, with no cards.
 */
export function Sovereignty() {
  return (
    <section className="relative isolate overflow-hidden bg-[#0D3B14] py-20 text-white sm:py-28">
      <div
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_top_left,black,transparent_75%)]"
        aria-hidden
      />
      <Container size="wide" className={`grid gap-14 lg:grid-cols-12 lg:gap-16 ${wrap}`}>
        <Reveal className="lg:col-span-5">
          <p className="text-sm font-semibold uppercase tracking-widest text-teal">
            Platform ownership and data sovereignty
          </p>
          <h2 className={`${h2} mt-4`}>A Niger State-owned platform</h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-white/80">
            The NSPHCDA Data Portal is fully owned, governed, and operated by Niger State through
            the Niger State Primary Health Care Development Agency (NSPHCDA). This is not a
            third-party or donor-managed system: all infrastructure, data, and governance
            decisions remain under the authority of the Niger State government.
          </p>
        </Reveal>

        <Reveal className="lg:col-span-7" delay={120}>
          <div className="grid grid-cols-1 gap-x-12 gap-y-10 sm:grid-cols-2">
            {sovereignty.map((item) => (
              <div key={item.title} className="border-t border-white/20 pt-6">
                <item.icon className="size-6 text-teal" aria-hidden />
                <h3 className={`${DISPLAY_SM} mt-4 text-xl font-semibold`}>{item.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-white/75">{item.body}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

/* ---------------------------------------------------------------------- partners */

/**
 * Layout family: logo rows. Each partner is a ruled row with the logo, the name
 * and the role. Roles are shown here (the home page wall shows logos only).
 */
export function KeyPartners() {
  return (
    <section className="py-20 sm:py-28">
      <Container size="wide" className={wrap}>
        <Reveal>
          <h2 className={h2}>Key partners</h2>
        </Reveal>
        <Reveal delay={100} className="mt-12">
          <ul className="grid grid-cols-1 border-t md:grid-cols-2 md:gap-x-16">
            {PARTNERS.map((partner) => {
              const logo = partner.logo;
              const wide = logo ? logo.width / logo.height >= 2 : false;
              return (
                <li
                  key={partner.name}
                  className="grid grid-cols-[6.5rem_1fr] items-center gap-6 border-b py-6"
                >
                  <div className="flex h-14 items-center justify-center">
                    {logo ? (
                      logo.onDark ? (
                        <span className="rounded-md bg-slate-900 px-2.5 py-2">
                          <Image
                            src={logo.src}
                            alt={`${partner.name} logo`}
                            width={logo.width}
                            height={logo.height}
                            className="h-auto w-20 object-contain"
                          />
                        </span>
                      ) : (
                        <Image
                          src={logo.src}
                          alt={`${partner.name} logo`}
                          width={logo.width}
                          height={logo.height}
                          unoptimized={logo.src.endsWith(".svg")}
                          className={
                            wide
                              ? "h-auto max-h-10 w-full object-contain dark:rounded-md dark:bg-white dark:p-1"
                              : "size-14 object-contain"
                          }
                        />
                      )
                    ) : (
                      <span className="flex size-14 items-center justify-center rounded-full bg-muted text-lg font-bold text-primary">
                        {partner.name.slice(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className={`${DISPLAY_SM} text-lg font-semibold`}>{partner.name}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">{partner.role}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}

/* ---------------------------------------------------------------------- coverage */

/**
 * Layout family: chip cloud. The real list of Local Government Areas. The old
 * section showed random per-LGA percentages labelled "mock"; those are gone, and
 * real coverage lives on the map.
 */
export function LgaCoverage() {
  return (
    <section className="relative isolate overflow-hidden bg-muted/50 py-20 sm:py-28">
      <div
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(27,94,32,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(27,94,32,0.06)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
        aria-hidden
      />
      <Container size="wide" className={wrap}>
        <Reveal>
          <h2 className={h2}>All {NIGER_STATE_LGAS.length} LGAs of Niger State</h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
            Data on the portal is organised by Local Government Area across the whole state.
          </p>
        </Reveal>
        <Reveal delay={100} className="mt-10">
          <ul className="flex flex-wrap gap-2.5">
            {NIGER_STATE_LGAS.map((lga) => (
              <li
                key={lga}
                className="rounded-lg border bg-card px-3.5 py-2 text-sm font-medium"
              >
                {lga}
              </li>
            ))}
          </ul>
          <Link
            href="/map"
            className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            See dataset coverage on the map
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}
