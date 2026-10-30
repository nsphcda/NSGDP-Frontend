"use client";

import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { LearningContentProvider, useLearningContent } from "@/lib/learning/content";
import { GuideArticle } from "./guide-article";
import { LEARNING_BASE_PATH, LearningShell, type LearningVariant } from "./learning-shell";

function GuidePageInner({ slug, variant }: { slug: string; variant: LearningVariant }) {
  const { content, isLoading } = useLearningContent();
  const guide = content.guides.find((g) => g.slug === slug);
  const basePath = LEARNING_BASE_PATH[variant];

  return (
    <LearningShell
      variant={variant}
      eyebrow="Learning hub"
      eyebrowIcon={GraduationCap}
      title="Learning hub"
      description="Follow the steps below, then mark the guide complete to track your progress."
    >
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-40 w-full" />
        </div>
      ) : guide ? (
        <GuideArticle guide={guide} basePath={basePath} />
      ) : (
        <div className="rounded-2xl border bg-card p-8 text-center">
          <p className="text-sm font-medium">This guide is not available.</p>
          <p className="mt-1 text-[13px] text-muted-foreground">
            It may have been unpublished or moved.
          </p>
          <Link href={basePath} className="mt-4 inline-block text-sm font-medium text-primary hover:underline">
            Back to the learning hub
          </Link>
        </div>
      )}
    </LearningShell>
  );
}

/** Shell + article for one guide on either surface. Content comes from the learning API. */
export function GuidePage({ slug, variant }: { slug: string; variant: LearningVariant }) {
  return (
    <LearningContentProvider>
      <GuidePageInner slug={slug} variant={variant} />
    </LearningContentProvider>
  );
}
