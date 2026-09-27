// apps/my_fastify/src/app/routes/company/index.ts
import type { FastifyPluginAsync } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { companySchema, auditEventTypeSchema } from '@domo/schemas';
import { enrichAudit, authenticateHook, authorize } from '@domo/middleware';
import {
  companyHandler,
  getCompaniesHandler,
  getCompanyHandler,
  updateCompanyHandler,
  deleteCompanyHandler
} from '@domo/controllers';

const companyRoutes: FastifyPluginAsync = async (fastify) => {
  const server = fastify.withTypeProvider<ZodTypeProvider>();

  // Create Company
  server.post
  <{ Params: Record<string, never> }>(
    '/',
    {
      preHandler: [
        authorize('canCreateCompany'),
        enrichAudit(auditEventTypeSchema.enum.create_company),
      ],
      schema: {
        body: companySchema,
      },
    },
    companyHandler,
  );

  // Get All Companies
  server.get<{ Params: Record<string, never> }>(
    '/companies',
    { onRequest: [authenticateHook] },
    getCompaniesHandler
  );

  // Get Single Company
  server.get<{ Params: { id: string } }>(
    '/getCompany/:id',
    { onRequest: [authenticateHook] },
    getCompanyHandler
  );

  // Update Company
  server.put<{ Params: { id: string } }>(
    '/updateCompany/:id',
    {
      onRequest: [authenticateHook],
      preHandler: [
        authorize('canEditAnyCompany'),
        enrichAudit('update_company'),
      ],
      schema: {
        body: companySchema,
        params: {
          type: 'object',
          properties: {
            id: { type: 'string' },
          },
          required: ['id'],
        },
      },
    },
    updateCompanyHandler,
  );

  // Delete Company
  server.delete<{ Params: { id: string } }>(
    '/deleteCompany/:id',
    {
      onRequest: [authenticateHook],
      preHandler: [
        authorize('canDeleteAnyCompany'),
        enrichAudit('delete_company'),
      ],
      schema: {
        params: {
          type: 'object',
          properties: {
            id: { type: 'string' },
          },
          required: ['id'],
        },
      },
    },
    deleteCompanyHandler,
  );
};

export { companyRoutes };