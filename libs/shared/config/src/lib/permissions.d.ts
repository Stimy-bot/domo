import { RoleType } from '@domo/models';
declare const superAdminPermissions: readonly ["canViewAllUsers", "canViewCompanies", "canCreateCompany", "canViewSelf", "canEditSelf", "canDeleteSelf", "canEditAnyUser", "canDeleteCompany", "canEditAnyCompany", "canDeleteAnyCompany", "canActivateUser", "canDeactivateUser", "canDeactivateAnyUser", "canActivateAnyUser", "canChangeAnyUserRole", "canDeleteAnyUser", "canDeleteAllUsers", "canAccessSystemSettings"];
/**
 * Single source of truth for Role-to-Permission mapping.
 * Record<RoleType, string[]> ensures all DB roles are accounted for.
 */
export declare const rolePermissions: Record<RoleType, string[]>;
/**
 * Export a type representing all possible permission strings.
 * This is useful for intellisense in your 'authorize' middleware.
 */
export type Permission = (typeof superAdminPermissions)[number];
export {};
//# sourceMappingURL=permissions.d.ts.map