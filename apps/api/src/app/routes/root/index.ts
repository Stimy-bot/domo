// apps/api/src/routes/root/index.ts
import type { FastifyPluginAsync, FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import fastifyStatic from '@fastify/static';
import fs from 'node:fs';
import path from 'node:path';
import { INTERNAL_SERVER_ERROR, NOT_FOUND } from '@domo/constants';

const root: FastifyPluginAsync = async (
  fastify: FastifyInstance,
): Promise<void> => {
  const publicDir = path.resolve(process.cwd(), 'apps/api/src/public');
  const viewsDir = path.resolve(process.cwd(), 'apps/api/src/views');

  // 1. Serve static assets (CSS, Images, JS)
  await fastify.register(fastifyStatic, {
    root: publicDir,
    prefix: '/', // Serves /images/favicon.ico, /css/style.css, etc.
  });

  // 2. Direct shortcut for /favicon.ico requests
  fastify.get('/favicon.ico', async (_request: FastifyRequest, reply: FastifyReply) => {
    const faviconPath = path.join(publicDir, 'images/favicon.ico');

    if (fs.existsSync(faviconPath)) {
      reply.type('image/x-icon');
      return reply.send(fs.createReadStream(faviconPath));
    }

    return reply.code(444).send(); // Or 404 if missing
  });

  // 3. Custom 404 handler (Renders views/404.html)
fastify.setNotFoundHandler((_request: FastifyRequest, reply: FastifyReply) => {
  const notFoundPath = path.join(viewsDir, '404.html');

  if (fs.existsSync(notFoundPath)) {
    return reply.type('text/html').sendFile('404.html');
  }

  return reply.status(NOT_FOUND).send({ error: 'Not Found' });
});

  // 4. Root route (Renders views/index.html)
  fastify.get('', async (_request: FastifyRequest, reply: FastifyReply) => {
    const filePath = path.join(viewsDir, 'index.html');

    if (!fs.existsSync(filePath)) {
      reply.code(INTERNAL_SERVER_ERROR);
      return {
        statusCode: INTERNAL_SERVER_ERROR,
        error: 'Internal Server Error',
        message: 'Required layout asset missing from build output.',
        debugInfo: { runningFrom: process.cwd(), lookedAt: filePath },
      };
    }

    reply.type('text/html');
    return reply.send(fs.createReadStream(filePath));
  });
};

export default root;