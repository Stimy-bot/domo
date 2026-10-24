import { deleteSessionHandler, getSessionsHandler } from '@domo/controllers';
import type { FastifyPluginAsync } from 'fastify';

export const sessionRoutes: FastifyPluginAsync = async fastify => {
  fastify.get('/', getSessionsHandler);
  fastify.delete('/:id', deleteSessionHandler);
};

export default sessionRoutes;
