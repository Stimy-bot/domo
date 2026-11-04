import type { Permission } from '@domo/config';
import { FORBIDDEN, UNAUTHORIZED } from '@domo/types';
import { appAssert } from '@domo/utils/server';
import type { FastifyRequest } from 'fastify';

export const authorize = (requiredPermissions: Permission | Permission[]) => {
  return async (req: FastifyRequest) => {
    // Check req.user first, then fallback to req.authUser
    const request = req as FastifyRequest & {
      user?: { role?: unknown; permissions?: unknown };
      authUser?: { role?: unknown; permissions?: unknown };
    };
    const user = request.user || request.authUser;

    // 1) Ensure request is authenticated
    appAssert(user, UNAUTHORIZED, 'Authentication required');

    // 2) Normalize role(s) to array of lowercase strings
    const rawRole = user.role;
    const userRoles: string[] = Array.isArray(rawRole)
      ? rawRole.map((r: unknown) => String(r).toLowerCase())
      : rawRole
        ? [String(rawRole).toLowerCase()]
        : [];

    // 3) SuperAdmin bypass (checks lowercased strings)
    if (userRoles.includes('superadmin') || userRoles.includes('super_admin')) {
      return;
    }

    // 4) Normalize required permissions input into an array
    const permissionsArray: Permission[] = Array.isArray(requiredPermissions)
      ? requiredPermissions
      : [requiredPermissions];

    // 5) Normalize user's active permissions into standard string array
    const userPerms: string[] = Array.isArray(user.permissions)
      ? user.permissions.map((p: unknown) => String(p))
      : [];

    // 6) Check if user possesses ANY of the required permissions (OR logic)
    const hasPermission = permissionsArray.some(permission => userPerms.includes(permission));

    appAssert(
      hasPermission,
      FORBIDDEN,
      `Forbidden: You need one of these permissions: [${permissionsArray.join(', ')}]`,
    );
  };
};
