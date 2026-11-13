import type { Metadata } from "next";
import { AboutHero } from "@/components/about/about-hero";
import {
  Overview,
  MissionVision,
  WhatWeDo,
  Sovereignty,
  KeyPartners,
  LgaCoverage,
} from "@/components/about/about-sections";
import { Testimonials } from "@/components/about/testimonials";
import { HomeStats } from "@/components/home/home-hero";
import { ClosingCta } from "@/components/home/closing-cta";

export const metadata: Metadata = { title: "About us" };

/**
 * About page. Section order and the layout family of each:
 *   hero (photo) > live stats (overlapping strip) > overview (editorial split)
 *   > mission and vision (statement pair) > what we do (ruled table)
 *   > ownership (dark band) > partners (logo rows) > testimonials (hidden until
 *   real quotes exist) > LGAs (chip cloud) > closing call to action.
 *
 * Numbers come from the live statistics endpoint. The earlier invented figures
 * (healthcare workers, data points, accuracy), the random per-LGA coverage bars
 * and the placeholder testimonials were removed rather than restyled.
 */
export default function AboutPage() {
  return (
    <main className="flex-1">
      <AboutHero />
      <HomeStats />
      <Overview />
      <MissionVision />
      <WhatWeDo />
      <Sovereignty />
      <KeyPartners />
      <Testimonials />
      <LgaCoverage />
      <ClosingCta />
    </main>
  );
}
