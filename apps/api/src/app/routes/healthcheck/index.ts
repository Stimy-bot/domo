// fastify/src/spp/routes/healthcheck/index.ts
import { Type } from '@sinclair/typebox';
import type { FastifyPluginAsync } from 'fastify';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';

interface HealthQuery {
  name?: string;
}

const healthcheck: FastifyPluginAsync = async function (fastify, _opts) {
  fastify.withTypeProvider<TypeBoxTypeProvider>().get(
    '/',
    {
      schema: {
        querystring: Type.Object({
          name: Type.String({ default: 'world' }),
        }),
        response: {
          200: Type.Object({
            hello: Type.String(),
          }),
        },
      },
    },
    async (req) => {
      const { name } = req.query as HealthQuery;
      return { hello: name ?? 'world' };
    },
  );
};

export default healthcheck;
