import { FastifyRequest, FastifyReply } from 'fastify';
import { ZodType } from 'zod';
declare function validateBody(schema: ZodType<unknown>): (req: FastifyRequest, reply: FastifyReply) => Promise<undefined>;
export { validateBody };
//# sourceMappingURL=validate.d.ts.map