import type { FastifyRequest, FastifyReply } from "fastify";

type AsyncHandler<
  Req extends FastifyRequest = FastifyRequest,
  Rep extends FastifyReply = FastifyReply
> = (request: Req, reply: Rep) => Promise<unknown>;

const catchErrors =
  <Req extends FastifyRequest = FastifyRequest, Rep extends FastifyReply = FastifyReply>(
    handler: AsyncHandler<Req, Rep>
  ): AsyncHandler<Req, Rep> =>
  (request, reply) =>
    handler(request, reply);

export { catchErrors };
