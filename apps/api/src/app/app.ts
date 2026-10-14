// apps/api/src/app/app.ts
import { type FastifyPluginAsync, type FastifyServerOptions } from 'fastify';
import { type AutoloadPluginOptions } from '@fastify/autoload';
import cookiePlugin from './plugins/cookie.js';
import corsPlugin from './plugins/cors.js';
import jwtPlugin from './plugins/jwt.js';
import swagger from './plugins/swagger.js';
import errorHandlerPlugin from './plugins/error-handler.js';
import root from './routes/root/index.js';
import healthcheck from './routes/healthcheck/index.js';
import userRoutes from './routes/user/index.js';
import authRoutes from './routes/auth/index.js';
import mongodb from './plugins/mongodb.js';

export interface AppOptions
  extends FastifyServerOptions,
    Partial<AutoloadPluginOptions> {
  skipOverride?: boolean;
}

const options: AppOptions = {};

const app: FastifyPluginAsync<AppOptions> = async (
  fastify,
  opts,
): Promise<void> => {
  await fastify.register(mongodb, opts);
  await fastify.register(cookiePlugin, opts);
  await fastify.register(corsPlugin, opts);
  await fastify.register(jwtPlugin, opts);
  await fastify.register(swagger, opts);
  await fastify.register(errorHandlerPlugin, opts);

  // Register routes
  await fastify.register(healthcheck, { ...opts, prefix: '/healthcheck' });
  await fastify.register(root, { ...opts, prefix: '/' });
  await fastify.register(userRoutes, { ...opts, prefix: '/user' });
  await fastify.register(authRoutes, { ...opts, prefix: '/auth' })
};

export default app;
export { app, options };
