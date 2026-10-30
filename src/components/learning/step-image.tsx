"use client";

import { useCallback, useState } from "react";
import { ImageIcon, ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { mediaUrl } from "@/lib/learning/content";

/**
 * Screenshot inside a guide step. Reserves space and shows a shimmer while the
 * image loads (screenshots are served through a signed redirect, so the first
 * paint can take a moment), fades it in, and shows a clear message if it fails.
 */
export function StepImage({
  image,
}: {
  image: { url: string; alt: string; caption?: string };
}) {
  const [state, setState] = useState<"loading" | "loaded" | "error">("loading");

  // The image can finish loading before React attaches onLoad (cache, fast network).
  const attach = useCallback((img: HTMLImageElement | null) => {
    if (img?.complete) setState(img.naturalWidth > 0 ? "loaded" : "error");
  }, []);

  return (
    <figure className="mt-3">
      <div
        className={cn(
          "relative overflow-hidden rounded-xl border bg-muted/30",
          // Reserve a plausible height until the real one is known: no layout jump.
          state === "loading" && "aspect-[16/9]",
          state === "error" && "aspect-[16/7]",
        )}
      >
        {state === "loading" ? (
          <div
            className="absolute inset-0 flex animate-pulse items-center justify-center bg-gradient-to-br from-muted/60 via-muted/30 to-muted/60"
            role="status"
            aria-label="Loading screenshot"
          >
            <ImageIcon className="size-8 text-muted-foreground/40" aria-hidden />
          </div>
        ) : null}

        {state === "error" ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 px-4 text-center">
            <ImageOff className="size-7 text-muted-foreground/50" aria-hidden />
            <p className="text-xs text-muted-foreground">This screenshot could not be loaded.</p>
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element -- API-served media with a signed redirect; next/image would proxy it
          <img
            ref={attach}
            src={mediaUrl(image.url)}
            alt={image.alt}
            decoding="async"
            onLoad={() => setState("loaded")}
            onError={() => setState("error")}
            className={cn(
              "block w-full transition-opacity duration-300",
              state === "loaded" ? "h-auto opacity-100" : "absolute inset-0 size-full opacity-0",
            )}
          />
        )}
      </div>
      {image.caption ? (
        <figcaption className="mt-1.5 text-xs text-muted-foreground">{image.caption}</figcaption>
      ) : null}
    </figure>
  );
}
