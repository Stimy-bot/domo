// libs/shared/utils/src/lib/roles.ts

import type { UserRole } from '@domo/state'; // or wherever your UserRole lives

/**
 * Ensures roles is always a string array.
 */
export function normalizeRoles(role: UserRole[] | UserRole | null | undefined): UserRole[] {
  if (!role) return [];
  return Array.isArray(role) ? role : [role];
}

/**
 * Generic role checker.
 */
export function hasRole(
  roles: UserRole[] | UserRole | null | undefined,
  target: UserRole,
): boolean {
  const normalized = normalizeRoles(roles);
  return normalized.includes(target);
}

/**
 * Admin = admin OR superAdmin
 */
export function isAdmin(roles: UserRole[] | UserRole | null | undefined): boolean {
  const normalized = normalizeRoles(roles);
  return normalized.includes('admin') || normalized.includes('superAdmin');
}

/**
 * SuperAdmin only
 */
export function isSuperAdmin(roles: UserRole[] | UserRole | null | undefined): boolean {
  return hasRole(roles, 'superAdmin');
}
