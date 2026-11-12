"use client";

import { useState } from "react";
import { ChevronDown, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MapLegend } from "@/components/map/map-legend";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

interface LegendItem {
  label: string;
  color: string;
  description?: string;
}

interface MapCollapsibleLegendProps {
  title: string;
  items: LegendItem[];
  unit?: string;
  type?: "circle" | "gradient";
  className?: string;
  /** Extra legends stacked under the first (dataset map). */
  extra?: Array<{
    title: string;
    items: LegendItem[];
    type?: "circle" | "gradient";
  }>;
}

/**
 * Desktop: always-visible legend card.
 * Mobile: collapsed by default; expands in place when toggled.
 * Sits above Leaflet zoom (`bottomright`) on phones.
 */
export function MapCollapsibleLegend({
  title,
  items,
  unit,
  type = "circle",
  className,
  extra,
}: MapCollapsibleLegendProps) {
  const isMobile = useMediaQuery("(max-width: 1023px)");
  const [mobileExpanded, setMobileExpanded] = useState(false);

  // Avoid hydration flash — wait for matchMedia before painting.
  if (isMobile === null) return null;

  // Phones and tablets: collapsed to a button at the bottom left, clear of the chat
  // bubble (bottom right) and, on phones, the Leaflet zoom control.
  const positionClass = isMobile
    ? "absolute bottom-3 left-3 z-[1000]"
    : "absolute bottom-4 right-4 z-[1000]";

  if (isMobile && !mobileExpanded) {
    return (
      <Button
        size="sm"
        variant="secondary"
        className={cn("shadow-lg", positionClass, className)}
        onClick={() => setMobileExpanded(true)}
      >
        <List className="size-4 mr-1.5" />
        Legend
      </Button>
    );
  }

  return (
    <div
      className={cn(
        "space-y-2",
        positionClass,
        isMobile && "max-h-[40dvh] max-w-[min(100vw-1.5rem,16rem)] overflow-y-auto",
        className
      )}
    >
      {isMobile && (
        <div className="flex justify-end">
          <Button
            size="sm"
            variant="secondary"
            className="h-7 px-2 shadow-md"
            onClick={() => setMobileExpanded(false)}
          >
            <ChevronDown className="size-4 mr-1" />
            Hide
          </Button>
        </div>
      )}
      <MapLegend title={title} items={items} unit={unit} type={type} />
      {extra?.map((block) => (
        <MapLegend key={block.title} title={block.title} items={block.items} type={block.type} />
      ))}
    </div>
  );
}
