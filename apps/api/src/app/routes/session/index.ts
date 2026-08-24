import { FastifyPluginAsync } from 'fastify';
import {
  deleteSessionHandler,
  getSessionsHandler,
} from '@domo/controllers';

export const sessionRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/', getSessionsHandler);
  fastify.delete('/:id', deleteSessionHandler);
};

export default sessionRoutes