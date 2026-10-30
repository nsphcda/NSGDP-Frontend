"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL, apiClient } from "@/lib/api/client";
import { GUIDES } from "./guides";
import { LEARNING_PATHS } from "./paths";
import { FAQS, GLOSSARY } from "./reference";
import { PLATFORM_UPDATES, TEMPLATES } from "./support";
import { VIDEOS } from "./videos";
import type {
  FaqItem,
  GlossaryTerm,
  Guide,
  LearningPath,
  PlatformUpdate,
  TemplateAsset,
  VideoTutorial,
} from "./types";

/** Everything the Learning Hub renders. Edited in the admin portal, served by GET /learning/content. */
export interface LearningContent {
  guides: Guide[];
  paths: LearningPath[];
  videos: VideoTutorial[];
  faqs: FaqItem[];
  glossary: GlossaryTerm[];
  templates: TemplateAsset[];
  updates: PlatformUpdate[];
}

/** The content that shipped with the portal. Used when the API cannot be reached. */
export const STATIC_CONTENT: LearningContent = {
  guides: GUIDES,
  paths: LEARNING_PATHS,
  videos: VIDEOS,
  faqs: FAQS,
  glossary: GLOSSARY,
  templates: TEMPLATES,
  updates: PLATFORM_UPDATES,
};

/** Turn an API media path (e.g. /learning/assets/<id>/file) into a loadable URL. */
export function mediaUrl(path: string): string {
  return /^https?:\/\//i.test(path) ? path : `${API_BASE_URL}${path}`;
}

interface ApiEnvelope<T> {
  data: T;
}

export async function fetchLearningContent(): Promise<LearningContent> {
  const res = await apiClient.get<ApiEnvelope<LearningContent>>("/learning/content");
  return res.data.data;
}

interface LearningContentState {
  content: LearningContent;
  isLoading: boolean;
  /** True when showing the built-in copy because the API call failed. */
  isFallback: boolean;
}

const LearningContentContext = createContext<LearningContentState | null>(null);

export function LearningContentProvider({ children }: { children: ReactNode }) {
  const query = useQuery({
    queryKey: ["learning", "content"],
    queryFn: fetchLearningContent,
    staleTime: 60_000,
    retry: 1,
  });

  const value = useMemo<LearningContentState>(
    () => ({
      content: query.data ?? STATIC_CONTENT,
      isLoading: query.isLoading,
      isFallback: !query.data && query.isError,
    }),
    [query.data, query.isLoading, query.isError],
  );

  return (
    <LearningContentContext.Provider value={value}>{children}</LearningContentContext.Provider>
  );
}

export function useLearningContent(): LearningContentState {
  const ctx = useContext(LearningContentContext);
  if (!ctx) {
    throw new Error("useLearningContent must be used inside <LearningContentProvider>");
  }
  return ctx;
}
