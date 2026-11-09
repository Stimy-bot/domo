// apps/my_fastify/src/app/app.ts

import { authenticateHook } from '@domo/middleware';
import type { AutoloadPluginOptions } from '@fastify/autoload';
import type { FastifyPluginAsync, FastifyServerOptions } from 'fastify';
import cookiePlugin from './plugins/cookie';
import corsPlugin from './plugins/cors';
import errorHandlerPlugin from './plugins/error-handler';
import jwtPlugin from './plugins/jwt';
import mongodb from './plugins/mongodb';
import swagger from './plugins/swagger';
import { auditRoutes } from './routes/audit/index';
import { authRoutes } from './routes/auth/index';
import { companyRoutes } from './routes/company/index';
import healthCheck from './routes/healthcheck/index';
import { markerRoutes } from './routes/markers/index';
import { roleRoutes } from './routes/role/index';
import root from './routes/root/index.js';
import { sessionRoutes } from './routes/session/index';
import { userRoutes } from './routes/user/index';

export interface AppOptions extends FastifyServerOptions, Partial<AutoloadPluginOptions> {
  skipOverride?: boolean;
}

const options: AppOptions = {};

const app: FastifyPluginAsync<AppOptions> = async (fastify, opts): Promise<void> => {
  await fastify.register(mongodb, opts);
  await fastify.register(cookiePlugin, opts);
  await fastify.register(corsPlugin, opts);
  await fastify.register(jwtPlugin, opts);
  await fastify.register(swagger, opts);
  await fastify.register(errorHandlerPlugin, opts);

  // Register routes
  await fastify.register(markerRoutes, { ...opts, prefix: '/marker' });
  await fastify.register(healthCheck, { ...opts, prefix: '/healthcheck' });
  await fastify.register(authRoutes, { ...opts, prefix: '/api/auth' });
  await fastify.register(root, { ...opts, prefix: '/' });
  await fastify.register(async (protectedScope) => {
    protectedScope.addHook('onRequest', authenticateHook);
    await protectedScope.register(userRoutes, {
      ...opts,
      prefix: '/user',
    });
    await protectedScope.register(sessionRoutes, {
      ...opts,
      prefix: '/session',
    });
    await protectedScope.register(companyRoutes, {
      ...opts,
      prefix: '/company',
    });
    await protectedScope.register(auditRoutes, {
      ...opts,
      prefix: '/audit',
    });
    await protectedScope.register(roleRoutes, {
      ...opts,
      prefix: '/role',
    });
  });
};

export default app;
export { app, options };
