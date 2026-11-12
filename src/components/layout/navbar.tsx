"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  ChevronDown,
  LogOut,
  LayoutDashboard,
  Settings,
  Menu,
  X,
  Map,
  MapPin,
  Database,
  FileText,
  Handshake,
  Hospital,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { NotificationBell } from "@/components/layout/notification-bell";
import { GeoHealthLogo } from "@/components/layout/geohealth-logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/analytics", label: "Analytics Dashboard" },
  { href: "/programs", label: "Programs" },
  { href: "/learning", label: "Learning" },
];

type MenuLink = {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
};

const DATA_PORTAL_LINKS: MenuLink[] = [
  {
    href: "/dataportal",
    label: "Browse Datasets",
    description: "Verified health datasets from NSPHCDA and partners",
    icon: Database,
  },
  {
    href: "/documents",
    label: "Document Library",
    description: "Reports, guidance, and reference documents",
    icon: FileText,
  },
  // Public contribute entry: the upload wizard stays in the signed-in dashboard only
  {
    href: "/partner-data",
    label: "Contribute Data",
    description: "Submit partner data for review and publication",
    icon: Handshake,
  },
];

const GIS_LINKS: MenuLink[] = [
  {
    href: "/map",
    label: "Dataset Coverage Map",
    description: "See where published datasets cover the state",
    icon: Map,
  },
  {
    href: "/population-map",
    label: "Population & Facility Map",
    description: "Compare population need with facility distribution",
    icon: Users,
  },
  {
    href: "/facilities",
    label: "Facility Finder",
    description: "Search primary health facilities statewide",
    icon: Hospital,
  },
  {
    href: "/settlements",
    label: "Settlement Access Map",
    description: "See settlements relative to nearby facilities",
    icon: MapPin,
  },
];

/**
 * Desktop nav item. The active page gets a 2px amber bar on the header's bottom
 * edge instead of a filled pill, so the active state reads at a glance without
 * adding weight. Applies to plain links and to the two dropdown triggers.
 */
const navItemBase =
  "relative inline-flex h-16 shrink-0 items-center gap-1 whitespace-nowrap px-2 text-sm font-medium 2xl:px-3 outline-none transition-colors motion-reduce:transition-none " +
  "after:absolute after:inset-x-2 after:bottom-0 2xl:after:inset-x-3 after:h-0.5 after:rounded-full after:bg-teal after:opacity-0 after:transition-opacity hover:after:opacity-40 " +
  "data-[active=true]:after:opacity-100 [&[data-popup-open]>svg]:rotate-180";

/** Text colours for the two header states: over the hero (white) and solid (theme). */
const navItem = (onHero: boolean) =>
  cn(
    navItemBase,
    onHero
      ? "text-white/80 hover:text-white focus-visible:text-white data-[active=true]:text-white [&[data-popup-open]]:text-white"
      : "text-foreground/70 hover:text-foreground focus-visible:text-foreground data-[active=true]:text-foreground [&[data-popup-open]]:text-foreground"
  );

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // A 1px-wide marker at the very top of the page. When it leaves the viewport
  // the page has been scrolled. This flips state only when the edge is crossed,
  // so there is no scroll listener and no per-frame work.
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) =>
      setScrolled(!entry.isIntersecting)
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Transparent over the dark hero on the home page only; solid everywhere else.
  const isHome = pathname === "/";
  const onHero = isHome && !scrolled && !mobileOpen;

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    router.push("/");
    setMobileOpen(false);
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);
  const anyActive = (links: MenuLink[]) => links.some((l) => isActive(l.href));

  /** One dropdown: trigger plus a panel of real links with a one-line hint each. */
  const renderMenu = (label: string, links: MenuLink[]) => (
    <DropdownMenu>
      <DropdownMenuTrigger className={navItem(onHero)} data-active={anyActive(links)}>
        {label}
        <ChevronDown
          className="size-3.5 transition-transform duration-200"
          aria-hidden
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 p-2" sideOffset={0}>
        {links.map((l) => (
          <DropdownMenuItem
            key={l.href}
            render={<Link href={l.href} />}
            className={cn(
              "items-start gap-3 rounded-lg p-2.5",
              isActive(l.href) && "bg-primary/10"
            )}
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <l.icon className="size-4" aria-hidden />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold">{l.label}</span>
              <span className="mt-0.5 block text-xs font-normal leading-snug text-muted-foreground">
                {l.description}
              </span>
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <>
      <div
        ref={sentinelRef}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 h-24 w-px"
      />
      <header
        className={cn(
          "navbar z-40 w-full border-b transition-[background-color,border-color,box-shadow] duration-300 motion-reduce:transition-none",
          // Over the hero the header floats on top of it (out of flow); elsewhere it
          // keeps its place in the page and sticks.
          isHome ? "fixed inset-x-0 top-0" : "sticky top-0",
          onHero
            ? // .navbar adds a drop shadow in globals.css; on a transparent header it
              // reads as a line along the bottom edge, so it is switched off here.
              "border-transparent bg-transparent shadow-none"
            : "border-border/60 bg-background/90 backdrop-blur-xl",
          isHome && !onHero && "shadow-sm"
        )}
      >
        <div className="mx-auto flex h-16 max-w-[96rem] items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
          <GeoHealthLogo
            className={cn(
              "shrink-0",
              onHero && "[&_.leading-tight>div:first-child]:text-white"
            )}
          />

          {/* Desktop nav */}
          <nav className="hidden h-full min-w-0 items-center xl:flex" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={navItem(onHero)}
                data-active={isActive(link.href)}
                aria-current={isActive(link.href) ? "page" : undefined}
              >
                {link.label}
              </Link>
            ))}
            {renderMenu("Explore Data", DATA_PORTAL_LINKS)}
            {renderMenu("GIS Mapping", GIS_LINKS)}
          </nav>

          {/* Desktop right actions */}
          <div
            className={cn(
              "flex shrink-0 items-center gap-1.5 sm:gap-2",
              onHero &&
                "[&_button]:text-white [&_button:hover]:bg-white/15 [&_button:hover]:text-white"
            )}
          >
            <ThemeToggle />

            {isAuthenticated && (
              <div className="hidden sm:block">
                <NotificationBell />
              </div>
            )}

            {!isAuthenticated ? (
              <>
                <Link
                  href="/login"
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    "hidden sm:inline-flex",
                    onHero && "text-white hover:bg-white/15 hover:text-white"
                  )}
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className={cn(
                    buttonVariants({ size: "sm" }),
                    "hidden font-semibold sm:inline-flex",
                    onHero
                      ? "bg-white text-[#0D3B14] hover:bg-white/90"
                      : "bg-primary hover:bg-primary/90"
                  )}
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger
                  className="hidden items-center gap-2 rounded-lg px-2 py-1 hover:bg-muted sm:flex"
                  aria-label="User menu"
                >
                  <div className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    {user?.firstName?.charAt(0) || user?.lastName?.charAt(0) || "U"}
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>{user?.firstName} {user?.lastName}</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                      <LayoutDashboard className="size-4" /> Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/dashboard/profile")}>
                      <Settings className="size-4" /> Settings
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="size-4" /> Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Mobile hamburger */}
            <button
              className="ml-1 flex size-11 items-center justify-center rounded-md hover:bg-muted xl:hidden"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-30 flex xl:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />

          {/* Panel */}
          <nav
            className="relative ml-auto flex h-full w-72 max-w-[85vw] flex-col overflow-y-auto bg-background shadow-xl"
            aria-label="Mobile navigation"
          >
            <div className="flex items-center justify-between border-b px-4 py-4">
              <GeoHealthLogo compact />
              <button
                onClick={() => setMobileOpen(false)}
                className="rounded-md p-1.5 hover:bg-muted"
                aria-label="Close menu"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="flex flex-col gap-0.5 p-3">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted",
                    isActive(link.href) && "bg-primary/10 font-semibold text-primary"
                  )}
                >
                  {link.label}
                </Link>
              ))}

              <div className="mt-2 border-t pt-2">
                <p className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Explore Data
                </p>
                {DATA_PORTAL_LINKS.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-muted",
                      isActive(l.href) && "bg-primary/10 font-semibold text-primary"
                    )}
                  >
                    <l.icon className="size-4 text-muted-foreground" />
                    {l.label}
                  </Link>
                ))}
              </div>

              <div className="mt-2 border-t pt-2">
                <p className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  GIS Mapping
                </p>
                {GIS_LINKS.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-muted",
                      isActive(l.href) && "bg-primary/10 font-semibold text-primary"
                    )}
                  >
                    <l.icon className="size-4 text-muted-foreground" />
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile auth */}
            <div className="mt-auto space-y-2 border-t p-4">
              {!isAuthenticated ? (
                <>
                  <Link href="/login" onClick={() => setMobileOpen(false)} className="block">
                    <Button variant="outline" className="w-full">Log In</Button>
                  </Link>
                  <Link href="/register" onClick={() => setMobileOpen(false)} className="block">
                    <Button className="w-full bg-primary font-semibold hover:bg-primary/90">
                      Sign Up
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2.5">
                    <div className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                      {user?.firstName?.charAt(0) || user?.lastName?.charAt(0) || "U"}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{user?.firstName} {user?.lastName}</p>
                      <p className="truncate text-xs capitalize text-muted-foreground">{user?.role.replace("_", " ") || ""}</p>
                    </div>
                  </div>
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted">
                    <LayoutDashboard className="size-4" /> Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
                  >
                    <LogOut className="size-4" /> Log Out
                  </button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
