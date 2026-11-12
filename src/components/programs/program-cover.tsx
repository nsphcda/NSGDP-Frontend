import {
  Activity,
  Building2,
  FlaskConical,
  GraduationCap,
  HeartPulse,
  ScanSearch,
  Syringe,
  type LucideIcon,
} from "lucide-react";
import type { Program, ProgramType } from "@/types";
import { cn } from "@/lib/utils";

const FALLBACKS: Record<ProgramType, { icon: LucideIcon; tint: string }> = {
  campaign: { icon: Syringe, tint: "from-emerald-700 to-emerald-500" },
  surveillance: { icon: Activity, tint: "from-teal-800 to-teal-500" },
  screening: { icon: ScanSearch, tint: "from-cyan-800 to-emerald-500" },
  training: { icon: GraduationCap, tint: "from-green-800 to-lime-600" },
  infrastructure: { icon: Building2, tint: "from-slate-700 to-emerald-600" },
  research: { icon: FlaskConical, tint: "from-emerald-900 to-teal-600" },
  other: { icon: HeartPulse, tint: "from-emerald-800 to-emerald-500" },
};

/**
 * Programme picture: the cover photo when there is one, otherwise a calm
 * generated cover by programme type. Fills its parent; the parent sets the
 * aspect ratio.
 */
export function ProgramCover({
  program,
  className,
  priority = false,
}: {
  program: Pick<Program, "name" | "type" | "coverImage">;
  className?: string;
  priority?: boolean;
}) {
  const cover = program.coverImage;
  if (cover) {
    return (
      // Signed-redirect media from the API: next/image cannot optimise it.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={cover.thumbUrl}
        alt={cover.alt || cover.caption || program.name}
        width={cover.width}
        height={cover.height}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className={cn("size-full object-cover", className)}
      />
    );
  }

  const { icon: Icon, tint } = FALLBACKS[program.type] ?? FALLBACKS.other;
  return (
    <div
      aria-hidden
      className={cn(
        "relative flex size-full items-center justify-center overflow-hidden bg-gradient-to-br",
        tint,
        className,
      )}
    >
      <div className="absolute -right-10 -top-10 size-44 rounded-full bg-white/10" />
      <div className="absolute -bottom-12 -left-8 size-40 rounded-full bg-white/10" />
      <Icon className="relative size-12 text-white/80" strokeWidth={1.25} />
    </div>
  );
}
