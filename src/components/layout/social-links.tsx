import { FaFacebookF, FaLinkedinIn, FaTiktok } from "react-icons/fa6";

/**
 * NSPHCDA's official social accounts. LinkedIn and Facebook point at the agency's
 * posts for now (tracking parameters removed); swap in the profile pages when
 * confirmed. TikTok points at the profile.
 */
const SOCIAL_LINKS = [
  {
    label: "NSPHCDA on LinkedIn",
    href: "https://www.linkedin.com/posts/niger-state-primary-health-care-development-agency-nsphcda-659b1932a_nigerphcdialogue2026-healthforallniger-nigerwillthrive-ugcPost-7458140224032952320-xdmx",
    Icon: FaLinkedinIn,
  },
  {
    label: "NSPHCDA on TikTok",
    href: "https://www.tiktok.com/@nsphdaniger",
    Icon: FaTiktok,
  },
  {
    label: "NSPHCDA on Facebook",
    href: "https://www.facebook.com/share/p/1DcFFtoEDr/",
    Icon: FaFacebookF,
  },
] as const;

export function SocialLinks({ className }: { className?: string }) {
  return (
    <ul className={className ?? "flex items-center gap-3"} aria-label="Social media">
      {SOCIAL_LINKS.map(({ label, href, Icon }) => (
        <li key={href}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            title={label}
            className="flex size-10 items-center justify-center rounded-full border border-white/20 text-white/80 transition-colors hover:border-white/50 hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <Icon className="size-4" aria-hidden />
          </a>
        </li>
      ))}
    </ul>
  );
}
