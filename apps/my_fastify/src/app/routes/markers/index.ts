// apps/my_fastify/src/app/routes/markers/index.ts

import { INTERNAL_SERVER_ERROR, OK } from '@domo/types';
import type { FastifyPluginAsync } from 'fastify';

const markerRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/', async (_req, reply) => {
    try {
      const markers = [
        {
          id: 1,
          name: 'First Marker',
          position: { lat: 38.885215, lng: -76.956672 },
        },
      ];

      return reply.status(OK).send(markers);
    } catch (error) {
      return reply.status(INTERNAL_SERVER_ERROR).send({ message: 'Failed to load markers' });
    }
  });
};

export { markerRoutes };
