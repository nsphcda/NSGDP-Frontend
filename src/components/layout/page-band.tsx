import type { ReactNode } from "react";
import { Container } from "@/components/layout/container";
import { DISPLAY_XL } from "@/components/home/home-fonts";
import { cn } from "@/lib/utils";

/**
 * Page header band used across the public pages: deep green with a soft glow
 * and a faint grid, a teal label, a tight heading and a short description.
 * `children` renders below the description (search box, buttons, chips).
 * Pass the same `size` as the page content so the edges line up.
 */
export function PageBand({
  eyebrow,
  title,
  description,
  size = "default",
  children,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  size?: "default" | "narrow" | "wide";
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("relative isolate overflow-hidden bg-[#0D3B14] text-white", className)}>
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_90%_at_85%_0%,rgba(46,125,50,0.5),transparent_65%)]"
        aria-hidden
      />
      <div
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:linear-gradient(to_bottom,black,transparent_90%)]"
        aria-hidden
      />
      <Container size={size} className="px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        {eyebrow ? (
          <p className="text-sm font-semibold uppercase tracking-widest text-teal">{eyebrow}</p>
        ) : null}
        <h1 className={cn(DISPLAY_XL, "text-4xl font-bold sm:text-5xl", eyebrow && "mt-3")}>
          {title}
        </h1>
        {description ? (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/80">{description}</p>
        ) : null}
        {children}
      </Container>
    </section>
  );
}
