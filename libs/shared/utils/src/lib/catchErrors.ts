import type { FastifyRequest, FastifyReply } from "fastify";

type AsyncHandler<
  Req extends FastifyRequest = FastifyRequest,
  Rep extends FastifyReply = FastifyReply
> = (request: Req, reply: Rep) => Promise<any>;

const catchErrors =
  <Req extends FastifyRequest = FastifyRequest, Rep extends FastifyReply = FastifyReply>(
    handler: AsyncHandler<Req, Rep>
  ): AsyncHandler<Req, Rep> =>
  async (request, reply) => {
    try {
      return await handler(request, reply);
    } catch (error) {
      // Re-throw to let Fastify's setErrorHandler process it
      throw error;
    }
  };

export { catchErrors };