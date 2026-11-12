import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import { Container } from "@/components/layout/container";
import { GeoHealthLogo } from "@/components/layout/geohealth-logo";
import { SocialLinks } from "@/components/layout/social-links";
import { BRAND } from "@/lib/constants/brand";

const DATA_LINKS = [
  { href: "/dataportal", label: "Explore Data" },
  { href: "/analytics", label: "Analytics Dashboard" },
  { href: "/documents", label: "Document Library" },
  { href: "/partner-data", label: "Contribute Data" },
  { href: "/programs", label: "Programs" },
  { href: "/learning", label: "Learning Hub" },
];

const MAP_LINKS = [
  { href: "/map", label: "Dataset Coverage Map" },
  { href: "/population-map", label: "Population & Facility Map" },
  { href: "/facilities", label: "Facility Finder" },
  { href: "/settlements", label: "Settlement Access Map" },
];

const PARTNER_ROLES = [
  { role: "Lead agency", name: "NSPHCDA" },
  { role: "Funded by", name: "Umbrella Fund" },
  { role: "Implemented by", name: "FACT Foundation" },
  { role: "Supported by", name: "Niger State Ministry of Health" },
];

const linkClass =
  "text-[15px] text-white/75 transition-colors hover:text-white hover:underline underline-offset-4";
const headingClass = "text-sm font-semibold text-teal";

/**
 * Site footer in the fixed deep brand green, in both themes. Four parts: brand
 * and partner roles, two grouped link columns, contact, and a legal bar. Every
 * link from the previous footer is kept. Social links are in SocialLinks. Not shown:
 * the placeholder phone number; add it back here once real.
 */
export function Footer() {
  return (
    <footer className="mt-auto bg-[#0D3B14] text-white">
      <Container size="wide" className="px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 py-16 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <GeoHealthLogo className="[&_.leading-tight]:block [&_.leading-tight>div:first-child]:text-white" />
            <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-white/75">
              Centralised geospatial and health data platform for Niger State, funded by
              Umbrella Fund and implemented by FACT Foundation.
            </p>
            <dl className="mt-6 space-y-2 text-sm">
              {PARTNER_ROLES.map((p) => (
                <div key={p.role} className="flex gap-3">
                  <dt className="w-32 shrink-0 text-white/55">{p.role}</dt>
                  <dd className="font-medium text-white/90">{p.name}</dd>
                </div>
              ))}
            </dl>
            <SocialLinks className="mt-6 flex items-center gap-3" />
          </div>

          <nav className="lg:col-span-2" aria-label="Data and learning">
            <h3 className={headingClass}>Data and learning</h3>
            <ul className="mt-4 space-y-3">
              {DATA_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkClass}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="lg:col-span-3" aria-label="Maps">
            <h3 className={headingClass}>Maps</h3>
            <ul className="mt-4 space-y-3">
              {MAP_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkClass}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <h3 className={headingClass}>Contact</h3>
            <ul className="mt-4 space-y-4 text-[15px] text-white/75">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-white/55" aria-hidden />
                <span>NSPHCDA, Niger State Government Secretariat, Minna, Niger State</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 size-4 shrink-0 text-white/55" aria-hidden />
                <a
                  href="mailto:healthdata@nsphcda.ng.gov.ng"
                  className="min-w-0 transition-colors hover:text-white hover:underline underline-offset-4 [overflow-wrap:anywhere]"
                >
                  healthdata@nsphcda.ng.gov.ng
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/15 py-6 text-sm text-white/60 sm:flex-row">
          <span>
            © {new Date().getFullYear()} {BRAND.portalName}. All rights reserved.
          </span>
          <div className="flex gap-6">
            <Link href="/terms" className="transition-colors hover:text-white">
              Terms
            </Link>
            <Link href="/privacy" className="transition-colors hover:text-white">
              Privacy
            </Link>
            <Link href="/contact" className="transition-colors hover:text-white">
              Contact
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
