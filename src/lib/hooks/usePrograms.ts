import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import {
  getPrograms,
  getProgramBySlug,
  getOrganizationPrograms,
  getOrganizationProgramBySlug,
  createProgramApi,
  updateProgramApi,
  updateProgramProgressApi,
  deleteProgramApi,
  getProgramReports,
  createProgramReport,
  deleteProgramReportApi,
  uploadProgramImage,
  updateProgramImage,
  reorderProgramImages,
  deleteProgramImage,
  type GetProgramsParams,
} from '../api/programs';
import type { ProgramFormData, ProgramProgressUpdateData } from '@/lib/schemas/program';

export function usePrograms(
  params?: GetProgramsParams,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: ['programs', params],
    queryFn: () => getPrograms(params),
    staleTime: 2 * 60 * 1000,
    enabled: options?.enabled !== false,
  });
}

export function useProgramBySlug(slug: string) {
  return useQuery({
    queryKey: ['program', slug],
    queryFn: () => getProgramBySlug(slug),
    enabled: !!slug,
  });
}

/**
 * Org-scoped list (authenticated) — shows every status for the caller's own
 * organisation, including suspended/archived programmes the public list
 * hides. Use this for "My Programmes" management views.
 */
export function useOrganizationPrograms(
  params?: Omit<GetProgramsParams, 'developmentPartnerId'>,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: ['organization-programs', params],
    queryFn: () => getOrganizationPrograms(params),
    enabled: options?.enabled !== false,
    staleTime: 1 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

/**
 * Org-scoped single lookup — 404s if the slug isn't in the caller's own
 * organisation, so another org's programme can never load into a form.
 */
export function useOrganizationProgram(slug: string) {
  return useQuery({
    queryKey: ['organization-program', slug],
    queryFn: () => getOrganizationProgramBySlug(slug),
    enabled: !!slug,
  });
}

export function useProgramReports(slug: string) {
  return useQuery({
    queryKey: ['program-reports', slug],
    queryFn: () => getProgramReports(slug),
    enabled: !!slug,
  });
}

export function useCreateProgram() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ProgramFormData) => createProgramApi(data),
    onSuccess: (program) => {
      queryClient.invalidateQueries({ queryKey: ['programs'] });
      queryClient.invalidateQueries({ queryKey: ['organization-programs'] });
      queryClient.invalidateQueries({ queryKey: ['organization-program', program.slug] });
      queryClient.invalidateQueries({ queryKey: ['program', program.slug] });
    },
  });
}

export function useUpdateProgram() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ slug, data }: { slug: string; data: Partial<ProgramFormData> }) =>
      updateProgramApi(slug, data),
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({ queryKey: ['programs'] });
      queryClient.invalidateQueries({ queryKey: ['program', variables.slug] });
      queryClient.invalidateQueries({ queryKey: ['organization-programs'] });
      queryClient.invalidateQueries({ queryKey: ['organization-program', variables.slug] });
    },
  });
}

export function useUpdateProgramProgress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ slug, data }: { slug: string; data: ProgramProgressUpdateData }) =>
      updateProgramProgressApi(slug, data),
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({ queryKey: ['programs'] });
      queryClient.invalidateQueries({ queryKey: ['program', variables.slug] });
      queryClient.invalidateQueries({ queryKey: ['organization-programs'] });
      queryClient.invalidateQueries({ queryKey: ['organization-program', variables.slug] });
    },
  });
}

export function useDeleteProgram() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (slug: string) => deleteProgramApi(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programs'] });
      queryClient.invalidateQueries({ queryKey: ['organization-programs'] });
    },
  });
}

/**
 * Photo gallery actions for one programme. Every change refreshes the
 * programme (cover and count live on it) and both lists.
 */
export function useProgramImageActions(slug: string) {
  const queryClient = useQueryClient();
  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['program', slug] });
    queryClient.invalidateQueries({ queryKey: ['organization-program', slug] });
    queryClient.invalidateQueries({ queryKey: ['programs'] });
    queryClient.invalidateQueries({ queryKey: ['organization-programs'] });
  };
  return {
    upload: useMutation({
      mutationFn: (v: { file: File; caption?: string; alt?: string }) =>
        uploadProgramImage(slug, v.file, { caption: v.caption, alt: v.alt }),
      onSuccess: refresh,
    }),
    update: useMutation({
      mutationFn: (v: {
        imageId: string;
        data: { caption?: string; alt?: string; isCover?: boolean };
      }) => updateProgramImage(slug, v.imageId, v.data),
      onSuccess: refresh,
    }),
    reorder: useMutation({
      mutationFn: (ids: string[]) => reorderProgramImages(slug, ids),
      onSuccess: refresh,
    }),
    remove: useMutation({
      mutationFn: (imageId: string) => deleteProgramImage(slug, imageId),
      onSuccess: refresh,
    }),
  };
}

export function useCreateProgramReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      slug,
      data,
    }: {
      slug: string;
      data: { title: string; description: string };
    }) => createProgramReport(slug, data),
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({ queryKey: ['program-reports', variables.slug] });
    },
  });
}

export function useDeleteProgramReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ slug, reportId }: { slug: string; reportId: string }) =>
      deleteProgramReportApi(slug, reportId),
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({ queryKey: ['program-reports', variables.slug] });
    },
  });
}
