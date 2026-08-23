import { RoleType } from '@domo/models';

/**
 * Define base permission sets to enable inheritance.
 * This prevents typos and ensures consistency across the role hierarchy.
 */

const userPermissions = [
  'canViewAllUsers',
  'canViewCompanies',
  'canCreateCompany',
  'canViewSelf',
  'canEditSelf',
  'canDeleteSelf',
] as const;

const adminPermissions = [
  ...userPermissions, // Inherits all user permissions
  'canEditAnyUser',
  'canDeleteCompany',
  'canEditAnyCompany',
  'canDeleteAnyCompany',
] as const;

const superAdminPermissions = [
  ...adminPermissions, // Inherits all admin permissions,
  'canActivateUser',
  'canDeactivateUser',
  'canDeactivateAnyUser',
  'canActivateAnyUser',
  'canChangeAnyUserRole',
  'canDeleteAnyUser',
  'canDeleteAllUsers',
  'canAccessSystemSettings',
] as const;

/**
 * Single source of truth for Role-to-Permission mapping.
 * Record<RoleType, string[]> ensures all DB roles are accounted for.
 */
export const rolePermissions: Record<RoleType, string[]> = {
  user: [...userPermissions],
  admin: [...adminPermissions],
  superAdmin: [...superAdminPermissions],
};

/**
 * Export a type representing all possible permission strings.
 * This is useful for intellisense in your 'authorize' middleware.
 */
export type Permission = (typeof superAdminPermissions)[number];