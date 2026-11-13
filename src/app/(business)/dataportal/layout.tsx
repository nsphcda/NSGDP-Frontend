import type { Metadata } from "next";

export const metadata: Metadata = { title: "Explore data" };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
