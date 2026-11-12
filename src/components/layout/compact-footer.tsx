import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import { GeoHealthLogo } from "@/components/layout/geohealth-logo";
import { SocialLinks } from "@/components/layout/social-links";
import { BRAND } from "@/lib/constants/brand";

const LINKS = [
  { href: "/dataportal", label: "Explore Data" },
  { href: "/analytics", label: "Analytics Dashboard" },
  { href: "/programs", label: "Programs" },
  { href: "/learning", label: "Learning Hub" },
  { href: "/documents", label: "Document Library" },
  { href: "/docs", label: "Architecture Docs" },
];

const linkClass =
  "text-[15px] text-white/75 transition-colors hover:text-white hover:underline underline-offset-4";
const headingClass = "text-sm font-semibold text-teal";

/**
 * Footer for pages with their own side navigation (docs, learning hub): a
 * trimmed version of the site footer, in the same deep green. It lives inside
 * the page's content column (not full width), so a fixed or sticky sidebar
 * never sits under or over it.
 */
export function CompactFooter() {
  return (
    <footer className="mt-8 overflow-hidden rounded-2xl bg-[#0D3B14] text-white">
      <div className="px-6 sm:px-8">
        <div className="grid grid-cols-1 gap-10 py-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-5">
            <GeoHealthLogo className="[&_.leading-tight]:block [&_.leading-tight>div:first-child]:text-white" />
            <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-white/75">
              Centralised geospatial and health data platform for Niger State, funded by Umbrella
              Fund and implemented by FACT Foundation.
            </p>
            <SocialLinks className="mt-6 flex items-center gap-3" />
          </div>

          <nav className="lg:col-span-3" aria-label="Quick links">
            <h3 className={headingClass}>Quick links</h3>
            <ul className="mt-4 space-y-3">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkClass}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-4">
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

        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/15 py-5 text-sm text-white/60 sm:flex-row">
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
      </div>
    </footer>
  );
}
