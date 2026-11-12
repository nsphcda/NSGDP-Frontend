// onDark: the file is a light-coloured logo made for dark backgrounds, so it is
// shown on a dark chip in both themes instead of being recoloured.
export type PartnerLogo = {
  src: string;
  width: number;
  height: number;
  onDark?: boolean;
};

export type Partner = {
  name: string;
  role: string;
  logo?: PartnerLogo;
};

/** Key partners, in display order. Shared by the home page and the About page. */
export const PARTNERS: Partner[] = [
  {
    name: "NSPHCDA",
    role: "Project Lead & Data Governance",
    logo: { src: "/images/partner-nsphcda.png", width: 256, height: 256 },
  },
  {
    name: "Niger State Ministry of Health",
    role: "Health Data Owner",
    logo: { src: "/images/partner-moh.png", width: 256, height: 256 },
  },
  {
    name: "Umbrella Fund",
    role: "Sponsor",
    logo: { src: "/images/umbrella-fund-logo.png", width: 2172, height: 724 },
  },
  {
    name: "FACT Foundation",
    role: "Implementation Partner",
    logo: { src: "/images/fact-foundation-logo.svg", width: 1960, height: 226 },
  },
  {
    name: "Dev-Afrique",
    role: "Technical Partner",
    logo: { src: "/images/dev-afrique-logo.webp", width: 506, height: 128, onDark: true },
  },
  {
    name: "ZeraSage",
    role: "Technical Partner",
    logo: { src: "/images/zerasage-logo.webp", width: 480, height: 51 },
  },
];
