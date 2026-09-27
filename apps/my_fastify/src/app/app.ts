// apps/my_fastify/src/app/app.ts
import { type FastifyPluginAsync, type FastifyServerOptions } from 'fastify';
import { type AutoloadPluginOptions } from '@fastify/autoload';
import cookiePlugin from './plugins/cookie';
import corsPlugin from './plugins/cors';
import jwtPlugin from './plugins/jwt';
import swagger from './plugins/swagger';
import errorHandlerPlugin from './plugins/error-handler';
import root from './routes/root/index.js';
import healthCheck from './routes/healthcheck/index';
import { userRoutes } from './routes/user/index';
import { authRoutes } from './routes/auth/index';
import { sessionRoutes } from './routes/session/index';
import { companyRoutes } from './routes/company/index'
import mongodb from './plugins/mongodb';
import { authenticateHook } from '@domo/middleware'; // Import hook


export interface AppOptions
  extends FastifyServerOptions, Partial<AutoloadPluginOptions> {
  skipOverride?: boolean;
}

const options: AppOptions = {};

const app: FastifyPluginAsync<AppOptions> = async (
  fastify: any,
  opts: any,
): Promise<void> => {
  await fastify.register(mongodb, opts);
  await fastify.register(cookiePlugin, opts);
  await fastify.register(corsPlugin, opts);
  await fastify.register(jwtPlugin, opts);
  await fastify.register(swagger, opts);
  await fastify.register(errorHandlerPlugin, opts);

  // Register routes
  await fastify.register(healthCheck, { ...opts, prefix: '/healthcheck' });
  await fastify.register(authRoutes, { ...opts, prefix: '/auth' });
  await fastify.register(root, { ...opts, prefix: '/' });
  await fastify.register(async (protectedScope: any) => {
    protectedScope.addHook('onRequest', authenticateHook);
    await protectedScope.register(userRoutes, { ...opts, prefix: '/user' });
    await protectedScope.register(sessionRoutes, { ...opts, prefix: '/session' });
    await protectedScope.register(companyRoutes, { ...opts, prefix: '/company'});
  });
};

export default app;
export { app, options };
