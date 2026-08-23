// apps/api/src/app/app.ts
import { type FastifyPluginAsync, type FastifyServerOptions } from 'fastify';
import { type AutoloadPluginOptions } from '@fastify/autoload';
import cookiePlugin from './plugins/cookie';
import corsPlugin from './plugins/cors';
import jwtPlugin from './plugins/jwt';
import swagger from './plugins/swagger';
import errorHandlerPlugin from './plugins/error-handler';
import root from './routes/root/index.js';
import healthCheck from './routes/healthcheck/index';
import {userRoutes} from './routes/user/index';
import {authRoutes} from './routes/auth/index';
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
  await fastify.register(healthCheck, { ...opts, prefix: '/healthcheck' });
  await fastify.register(root, { ...opts, prefix: '/' });
  await fastify.register(userRoutes, { ...opts, prefix: '/user' });
  await fastify.register(authRoutes, { ...opts, prefix: '/auth' })
};

export default app;
export { app, options };
