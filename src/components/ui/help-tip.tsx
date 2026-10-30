"use client";

import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type HelpTipProps = {
  content: string;
  className?: string;
  iconClassName?: string;
  side?: "top" | "bottom" | "left" | "right";
  label?: string;
};

export function HelpTip({
  content,
  className,
  iconClassName,
  side = "top",
  label = "Help",
}: HelpTipProps) {
  return (
    <Tooltip>
      <TooltipTrigger
        type="button"
        className={cn(
          "inline-flex shrink-0 text-muted-foreground hover:text-foreground focus-visible:outline-none",
          // Keep the small icon but give touch a 40px hit area without shifting layout.
          "max-md:-m-3.5 max-md:p-3.5",
          className,
        )}
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        aria-label={label}
      >
        <HelpCircle className={cn("size-4", iconClassName)} />
      </TooltipTrigger>
      <TooltipContent side={side} className="max-w-xs text-pretty sm:max-w-sm">
        {content}
      </TooltipContent>
    </Tooltip>
  );
}
