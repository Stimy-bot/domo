import type { FastifyPluginAsync, RouteHandlerMethod } from 'fastify';
import { 
  getUserHandler, 
  updateHandler, 
  deleteHandler, 
  deleteAllHandler, 
  toggleUserActiveStatusHandler, 
  getUsersHandler, 
} from '@domo/controllers';
import { updateSchema } from '@domo/schemas';
import { 
  enrichAudit, 
  authorize, 
  requireValidTargetId, 
} from '@domo/middleware';
import { validateBody } from '@domo/validate'

const userRoutes: FastifyPluginAsync = async (fastify) => {
  // --- 1. Current User Routes (Self) ---
  fastify.get('/', getUserHandler);

  // --- 2. Admin/Management Routes (Bulk/General) ---
  fastify.get('/users', getUsersHandler);

  fastify.delete(
    '/deleteAll',
    {
      preHandler: [
        authorize(['canDeleteSelf', 'canDeleteAnyUser', 'canDeleteAllUsers']),
        requireValidTargetId,
        enrichAudit('all_accounts_deletion'),
      ],
    },
    deleteAllHandler
  );

  // --- 3. Targeted User Routes (:id) ---
  fastify.get(
    '/:id',
    {
      preHandler: [requireValidTargetId],
    },
    getUserHandler as RouteHandlerMethod
  );

  fastify.patch(
    '/update/:id',
    {
      preHandler: [
        authorize('canEditSelf'),
        requireValidTargetId,
        validateBody(updateSchema),
        enrichAudit('user_update'),
      ],
    },
    updateHandler as RouteHandlerMethod
  );

  fastify.patch(
    '/deactivate/:id',
    {
      preHandler: [
        authorize(['canDeactivateUser', 'canDeactivateAnyUser']),
        requireValidTargetId,
        validateBody(updateSchema),
        enrichAudit('user_status_change'),
      ],
    },
    toggleUserActiveStatusHandler as RouteHandlerMethod
  );

  fastify.patch(
    '/activate/:id',
    {
      preHandler: [
        authorize(['canActivateUser', 'canActivateAnyUser']),
        requireValidTargetId,
        validateBody(updateSchema),
        enrichAudit('user_status_change'),
      ],
    },
    toggleUserActiveStatusHandler as RouteHandlerMethod
  );

  fastify.delete(
    '/delete/:id',
    {
      preHandler: [
        authorize(['canDeleteSelf', 'canDeleteAnyUser']),
        requireValidTargetId,
        enrichAudit('account_deletion'),
      ],
    },
    deleteHandler as RouteHandlerMethod
  );
};

export { userRoutes };