import type { Metadata } from "next";
import PortalArchitectureView from "@/components/architecture/portal-architecture-view";

export const metadata: Metadata = { title: "Architecture" };

export default function ArchitecturePage() {
  return <PortalArchitectureView />;
}
