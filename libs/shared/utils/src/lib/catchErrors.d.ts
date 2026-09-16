import type { FastifyRequest, FastifyReply } from "fastify";
type AsyncHandler<Req extends FastifyRequest = FastifyRequest, Rep extends FastifyReply = FastifyReply> = (request: Req, reply: Rep) => Promise<unknown>;
declare const catchErrors: <Req extends FastifyRequest = FastifyRequest, Rep extends FastifyReply = FastifyReply>(handler: AsyncHandler<Req, Rep>) => AsyncHandler<Req, Rep>;
export { catchErrors };
//# sourceMappingURL=catchErrors.d.ts.map