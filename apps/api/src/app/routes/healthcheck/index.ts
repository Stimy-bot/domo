import type { FastifyInstance } from 'fastify';
import { z } from 'zod';

export default async function healthCheck(fastify: FastifyInstance) {
  fastify.get(
    '/',
    {
      schema: {
        response: {
          200: z.object({
            hello: z.string(),
          }),
        },
      },
    },
    async () => {
      return { hello: 'world' };
    }
  );
}