// libs/shared/middleware/src/lib/authorize.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import { FORBIDDEN, UNAUTHORIZED } from '@domo/constants';
import {appAssert} from '@domo/utils';
import { Permission } from '@domo/config';
import { type UserEntity } from '@domo/models';

export const authorize = (requiredPermissions: Permission | Permission[]) => {
  return async (req: FastifyRequest, _reply: FastifyReply) => {
    const user = req.user as UserEntity | undefined;

    // 1) Ensure authenticated
    appAssert(user, UNAUTHORIZED, 'Authentication required');

    // 2) Normalize role(s) to an array of lowercase strings
    const rawRole = user.role;
    const userRoles: string[] = Array.isArray(rawRole)
      ? rawRole.map((r: unknown) => String(r).toLowerCase())
      : rawRole 
      ? [String(rawRole).toLowerCase()]
      : [];

    // 3) SuperAdmin bypass (case-insensitive)
    if (userRoles.some((r) => r === 'superadmin')) {
      return;
    }

    // 4) Normalize required permissions
    const permissionsArray: Permission[] = Array.isArray(requiredPermissions)
      ? requiredPermissions
      : [requiredPermissions];

    // 5) Normalize user permissions
    const permissions = (user as UserEntity & { permissions?: unknown }).permissions;
    const userPerms: string[] = Array.isArray(permissions)
      ? permissions.map((p: unknown) => String(p))
      : [];

    // 6) Verify OR logic permission match
    const hasPermission = permissionsArray.some((permission) =>
      userPerms.includes(permission)
    );

    appAssert(
      hasPermission,
      FORBIDDEN,
      `Forbidden: You need one of these permissions: [${permissionsArray.join(', ')}]`
    );
  };
};