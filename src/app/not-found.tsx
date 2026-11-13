import type { Metadata } from "next";
import Link from "next/link";
import { BarChart3, Database, GraduationCap, LayoutGrid, Mail, Map, type LucideIcon } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/layout/container";
import { NotFoundActions } from "@/components/layout/not-found-actions";
import { DISPLAY_XL } from "@/components/home/home-fonts";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

const POPULAR: Array<{ href: string; label: string; text: string; Icon: LucideIcon }> = [
  { href: "/dataportal", label: "Explore data", text: "Browse the health datasets", Icon: Database },
  { href: "/map", label: "Maps", text: "See coverage across the state", Icon: Map },
  { href: "/analytics", label: "Analytics", text: "Disease burden and trends", Icon: BarChart3 },
  { href: "/programs", label: "Programs", text: "Health work in the field", Icon: LayoutGrid },
  { href: "/learning", label: "Learning hub", text: "Guides, videos and training", Icon: GraduationCap },
  { href: "/contact", label: "Contact us", text: "Ask the portal team", Icon: Mail },
];

/** Shown for any address that does not exist, and when a page calls notFound(). */
export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="relative isolate overflow-hidden bg-[#0D3B14] text-white">
          <div
            className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_90%_at_85%_0%,rgba(46,125,50,0.5),transparent_65%)]"
            aria-hidden
          />
          <div
            className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:linear-gradient(to_bottom,black,transparent_90%)]"
            aria-hidden
          />
          {/* Oversized 404 behind the text; the real heading below carries the message. */}
          <span
            aria-hidden
            className={`${DISPLAY_XL} pointer-events-none absolute -right-4 -top-6 -z-10 select-none text-[11rem] font-black text-white/[0.06] sm:-top-10 sm:right-6 sm:text-[20rem] lg:right-16`}
          >
            404
          </span>
          <Container size="wide" className="px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
            <p className="text-sm font-semibold uppercase tracking-widest text-teal">Error 404</p>
            <h1 className={`${DISPLAY_XL} mt-3 max-w-3xl text-4xl font-bold sm:text-6xl`}>
              We can&apos;t find that page
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
              The link may be out of date, or the address may have a typo. Search for what you need,
              or pick one of the places below.
            </p>
            <NotFoundActions />
          </Container>
        </section>

        <section className="py-12 sm:py-16">
          <Container size="wide" className="px-4 sm:px-6 lg:px-8">
            <h2 className={`${DISPLAY_XL} text-2xl font-bold sm:text-3xl`}>Popular pages</h2>
            <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {POPULAR.map(({ href, label, text, Icon }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="group flex h-full items-center gap-4 rounded-2xl border bg-card p-4 transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:p-5"
                  >
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-semibold">{label}</span>
                      <span className="block text-sm text-muted-foreground">{text}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
