// apps/my_fastify/src/app/plugins/swagger.ts

import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUI from '@fastify/swagger-ui';
import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

/**
 * Swagger/OpenAPI plugin for this app.
 *
 * @see https://github.com/fastify/fastify-swagger
 * @see https://github.com/fastify/fastify-swagger-ui
 */
export default fp(async (fastify: FastifyInstance) => {
  fastify
    .register(fastifySwagger, {
      // swagger: openApiDocument,
    })
    .register(fastifySwaggerUI, {
      routePrefix: '/docs',
    });
});
