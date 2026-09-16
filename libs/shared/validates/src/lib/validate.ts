// src/validateZod/validate.ts
import type { FastifyRequest, FastifyReply } from 'fastify';
import { ZodType, ZodError } from 'zod';
import { BAD_REQUEST } from '@domo/types';

 function validateBody(schema: ZodType<unknown>) {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      req.log.debug({ body: req.body }, '[validateBody] incoming');

      // Parse and replace body with validated/transformed data
      req.body = await schema.parseAsync(req.body);
    } catch (err: unknown) {
      if (err instanceof ZodError) {
        const issues = err.issues.map((i) => ({
          path: i.path.join('.'),
          message: i.message,
          code: i.code,
        }));

        req.log.warn(
          { issues },
          '[validateBody] validation failed (detailed)'
        );

        const errorMessages = issues.map(
          (i) => `${i.path || '<root>'}: ${i.message}`
        );

        return reply.status(BAD_REQUEST).send({ errors: errorMessages });
      }

      // Re-throw uncaught/unexpected errors so Fastify's global errorHandler picks them up
      throw err;
    }
  };
}

export { validateBody }