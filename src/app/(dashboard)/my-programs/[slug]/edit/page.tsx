"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ChevronRight, ClipboardList, TrendingUp } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { HelpTip } from "@/components/ui/help-tip";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DashboardPage,
  DashboardPageContent,
} from "@/components/layout/dashboard-page-header";
import { DashboardPanel, EmptyPanelState } from "@/components/dashboard/portal-dashboard-ui";
import { ProgramProgressPanel } from "@/components/programs/program-progress-panel";
import { useOrganizationProgram } from "@/lib/hooks/usePrograms";
import { useProgramPermissions } from "@/lib/hooks/useProgramPermissions";
import { PORTAL_PROGRAM_PROGRESS_TIP } from "@/lib/constants/portal-tooltips";
import { cn } from "@/lib/utils";

/**
 * Partners update progress on the programmes the agency assigned to them. The
 * programme's name, dates, target LGAs, status and partner list are managed by
 * the agency in the admin portal.
 */
export default function UpdateProgrammeProgressPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const { can, canAccess } = useProgramPermissions();
  const { data: programme, isLoading, error } = useOrganizationProgram(slug);
  const [isRedirecting, setIsRedirecting] = useState(false);

  if (isLoading) {
    return (
      <DashboardPage>
        <div className="border-b bg-background px-4 py-4 sm:px-6">
          <Skeleton className="h-4 w-56" />
        </div>
        <div className="border-b bg-background px-4 py-5 sm:px-6">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="mt-2 h-4 w-1/2" />
        </div>
        <DashboardPageContent className="mx-auto max-w-3xl">
          <Skeleton className="h-96 rounded-2xl" />
        </DashboardPageContent>
      </DashboardPage>
    );
  }

  if (!canAccess || !can("edit")) {
    return (
      <DashboardPage>
        <DashboardPageContent>
          <EmptyPanelState
            icon={ClipboardList}
            message="You do not have permission to update programmes."
            action={
              <Link href="/dashboard" className={cn(buttonVariants({ variant: "outline" }), "h-11")}>
                Back to dashboard
              </Link>
            }
          />
        </DashboardPageContent>
      </DashboardPage>
    );
  }

  if (error || !programme) {
    return (
      <DashboardPage>
        <DashboardPageContent>
          <EmptyPanelState
            icon={ClipboardList}
            message="Programme not found, or it is not assigned to your development partner."
            action={
              <Link href="/my-programs" className={cn(buttonVariants({ variant: "outline" }), "h-11")}>
                Back to programmes
              </Link>
            }
          />
        </DashboardPageContent>
      </DashboardPage>
    );
  }

  const programmeHref = `/my-programs/${programme.slug}`;

  return (
    <DashboardPage>
      <div className="border-b bg-background px-4 py-3 sm:px-6">
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground sm:text-sm">
          <Link href="/my-programs" className="hover:text-foreground">
            Programmes
          </Link>
          <ChevronRight className="size-3.5 shrink-0 sm:size-4" />
          <Link href={programmeHref} className="truncate hover:text-foreground">
            {programme.name}
          </Link>
          <ChevronRight className="size-3.5 shrink-0 sm:size-4" />
          <span className="text-foreground">Update progress</span>
        </nav>
      </div>

      <div className="border-b bg-background px-4 py-5 sm:px-6 sm:py-6">
        <Link
          href={programmeHref}
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "mb-4 h-10 w-fit gap-2 px-0 hover:bg-transparent",
          )}
        >
          <ArrowLeft className="size-4" />
          Back to programme
        </Link>
        <div className="mb-2 inline-flex items-center gap-2 rounded-lg border border-primary/25 bg-primary/[0.06] px-2.5 py-1">
          <TrendingUp className="size-3.5 text-primary" aria-hidden />
          <span className="text-xs font-semibold uppercase tracking-wide text-primary">
            Progress update
          </span>
        </div>
        <h1 className="flex items-center gap-2 text-xl font-bold tracking-tight sm:text-2xl">
          Update progress
          <HelpTip content={PORTAL_PROGRAM_PROGRESS_TIP} label="Update progress help" />
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Record LGA coverage and outcome counts for{" "}
          <span className="font-medium text-foreground">{programme.name}</span>. The agency manages
          the programme&apos;s details and status.
        </p>
      </div>

      <DashboardPageContent className="mx-auto w-full max-w-3xl space-y-4">
        <DashboardPanel
          title="Progress"
          description="Changes here update coverage and reach counts."
          icon={TrendingUp}
          tone="primary"
        >
          <ProgramProgressPanel
            programme={programme}
            embedded
            onSuccess={() => {
              setIsRedirecting(true);
              router.push(programmeHref);
            }}
          />
        </DashboardPanel>
        {isRedirecting ? (
          <p className="text-center text-sm text-muted-foreground">Saved. Returning to the programme…</p>
        ) : null}
      </DashboardPageContent>
    </DashboardPage>
  );
}
