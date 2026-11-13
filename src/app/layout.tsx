import type { Metadata } from "next";
import { preconnect } from "react-dom";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
// import { RoleSwitcher } from "@/components/dev/role-switcher"; // Disabled: using real auth now
import { AiAssistantWidget } from "@/components/feedback/ai-assistant-widget";
import { BRAND } from "@/lib/constants/brand";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: BRAND.portalName,
    template: `%s | ${BRAND.portalName}`,
  },
  description:
    "NSPHCDA's centralised geospatial and health data platform — disease surveillance, facility mapping, analytics, and open health datasets across Niger State's 25 LGAs.",
  openGraph: {
    title: BRAND.portalName,
    siteName: BRAND.portalName,
    description: "Health data portal for evidence-based planning across Niger State.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: BRAND.portalName,
  },
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: { url: "/favicon-192.png", sizes: "192x192", type: "image/png" },
    shortcut: "/favicon-32.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Open the connection to the API (DNS, TCP and TLS) while the page is still loading,
  // so the first data request does not pay for the handshake (about a second on a
  // phone connection). Requests use credentials, so the preconnect must too.
  const apiOrigin = /^https?:\/\//.test(process.env.NEXT_PUBLIC_API_URL ?? "")
    ? new URL(process.env.NEXT_PUBLIC_API_URL as string).origin
    : null;
  if (apiOrigin) preconnect(apiOrigin, { crossOrigin: "use-credentials" });

  return (
    <html
      lang="en"
      className={`${inter.variable} ${mono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          {children}
          <AiAssistantWidget />
          {/* <RoleSwitcher /> */} {/* Disabled: using real auth now */}
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
