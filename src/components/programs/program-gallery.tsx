"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { ProgramImage } from "@/types";
import { cn } from "@/lib/utils";

/**
 * Photo gallery for a programme: a tidy grid (first photo large) that opens a
 * full-screen viewer. The viewer supports arrow keys, Escape, swipe, and
 * returns focus to the photo that opened it.
 */
export function ProgramGallery({
  images,
  programName,
}: {
  images: ProgramImage[];
  programName: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const opener = useRef<HTMLElement | null>(null);

  if (images.length === 0) return null;

  return (
    <>
      <ul className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-4">
        {images.map((image, index) => (
          <li
            key={image.id}
            className={cn(
              "overflow-hidden rounded-xl bg-muted",
              index === 0 && "col-span-2 row-span-2",
            )}
          >
            <button
              type="button"
              onClick={(e) => {
                opener.current = e.currentTarget;
                setOpenIndex(index);
              }}
              className="group relative block size-full min-h-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              aria-label={`Open photo ${index + 1} of ${images.length}${
                image.caption ? `: ${image.caption}` : ""
              }`}
            >
              <div className={cn("w-full", index === 0 ? "aspect-[4/3] sm:aspect-square" : "aspect-square")}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.thumbUrl}
                  alt={image.alt || image.caption || `${programName}, photo ${index + 1}`}
                  width={image.width}
                  height={image.height}
                  loading="lazy"
                  decoding="async"
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              {image.caption ? (
                <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 pt-8 text-left text-xs leading-snug text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 max-sm:opacity-100 sm:text-sm">
                  <span className="line-clamp-2">{image.caption}</span>
                </span>
              ) : null}
            </button>
          </li>
        ))}
      </ul>

      {openIndex !== null ? (
        <Lightbox
          images={images}
          programName={programName}
          index={openIndex}
          onIndex={setOpenIndex}
          onClose={() => {
            setOpenIndex(null);
            opener.current?.focus();
          }}
        />
      ) : null}
    </>
  );
}

function Lightbox({
  images,
  programName,
  index,
  onIndex,
  onClose,
}: {
  images: ProgramImage[];
  programName: string;
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const image = images[index];
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchStart = useRef<number | null>(null);

  const step = useCallback(
    (delta: number) => onIndex((index + delta + images.length) % images.length),
    [index, images.length, onIndex],
  );

  useEffect(() => {
    closeRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") step(-1);
      else if (e.key === "ArrowRight") step(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, step]);

  // Warm the neighbours so paging feels instant.
  useEffect(() => {
    [index - 1, index + 1].forEach((i) => {
      const n = images[(i + images.length) % images.length];
      if (n) new Image().src = n.url;
    });
  }, [index, images]);

  if (!image) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${programName} photo ${index + 1} of ${images.length}`}
      className="fixed inset-0 z-[100] flex flex-col bg-black/95"
      onClick={onClose}
      onTouchStart={(e) => {
        touchStart.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchStart.current === null) return;
        const dx = e.changedTouches[0].clientX - touchStart.current;
        touchStart.current = null;
        if (Math.abs(dx) > 50) step(dx > 0 ? -1 : 1);
      }}
    >
      <div className="flex items-center justify-between px-4 py-3 text-sm text-white/80">
        <span className="tabular-nums">
          {index + 1} / {images.length}
        </span>
        <button
          ref={closeRef}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="flex size-11 items-center justify-center rounded-full text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white"
          aria-label="Close photo viewer"
        >
          <X className="size-6" />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 sm:px-16">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={image.id}
          src={image.url}
          alt={image.alt || image.caption || `${programName}, photo ${index + 1}`}
          onClick={(e) => e.stopPropagation()}
          className="max-h-full max-w-full rounded-md object-contain"
        />
        {images.length > 1 ? (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                step(-1);
              }}
              className="absolute left-1 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-white sm:left-4"
              aria-label="Previous photo"
            >
              <ChevronLeft className="size-6" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                step(1);
              }}
              className="absolute right-1 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-white sm:right-4"
              aria-label="Next photo"
            >
              <ChevronRight className="size-6" />
            </button>
          </>
        ) : null}
      </div>

      <div className="min-h-16 px-4 py-4 text-center text-sm text-white/90" onClick={(e) => e.stopPropagation()}>
        {image.caption}
      </div>
    </div>
  );
}
