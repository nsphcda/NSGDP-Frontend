import type { UserRole } from "@/types";
import type { ProgramPermissionAction } from "@/types/permissions";

/**
 * Programmes are created and assigned by the agency (admin portal). A user of a
 * development partner (contributor or partner admin) can open the programmes the
 * partner is listed on, update their progress and upload reports. Who may do what
 * on a given programme is enforced by the API: it returns only programmes the
 * partner is assigned to, and answers 404 for the rest.
 */
const PARTNER_ACTIONS: ProgramPermissionAction[] = ["edit:programs", "upload:programs"];

const SUPER_ADMIN_ACTIONS: ProgramPermissionAction[] = [
  "create:programs",
  "edit:programs",
  "upload:programs",
  "delete:programs",
];

export function getEffectiveProgramPermissions(
  role: UserRole,
  // Kept for call-site compatibility: the old organisation capability no longer matters.
  _organisationCapabilities?: string[],
): ProgramPermissionAction[] {
  void _organisationCapabilities;
  if (role === "super_admin") return SUPER_ADMIN_ACTIONS;
  if (role === "contributor" || role === "admin") return PARTNER_ACTIONS;
  return [];
}

export function hasProgramPermission(
  role: UserRole,
  action: ProgramPermissionAction,
  organisationCapabilities?: string[],
): boolean {
  return getEffectiveProgramPermissions(role, organisationCapabilities).includes(action);
}

export type ProgramCapability = "create" | "edit" | "delete" | "upload";

const CAPABILITY_ACTION: Record<ProgramCapability, ProgramPermissionAction> = {
  create: "create:programs",
  edit: "edit:programs",
  delete: "delete:programs",
  upload: "upload:programs",
};

export function canProgram(
  role: UserRole,
  capability: ProgramCapability,
  organisationCapabilities?: string[],
): boolean {
  return hasProgramPermission(role, CAPABILITY_ACTION[capability], organisationCapabilities);
}

/** True when the user may open My Programmes. The list is empty until the agency assigns a programme. */
export function canAccessPrograms(
  role: UserRole,
  _organisationCapabilities?: string[],
): boolean {
  void _organisationCapabilities;
  return role === "super_admin" || role === "contributor" || role === "admin";
}
