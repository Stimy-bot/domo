// apps/fastify/src/app/plugins/jwt.ts
import fp from 'fastify-plugin';
import {
  createSigner,
  createVerifier,
  type SignerOptions,
  type VerifierOptions,
} from 'fast-jwt';
import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { Audience, loadEnv } from '@domo/constants';

const { JWT_SECRET, JWT_REFRESH_SECRET } = loadEnv();

const defaultAudience = [Audience.User, Audience.Admin, Audience.SuperAdmin];

export default fp(async (fastify: FastifyInstance) => {
  const accessSigner = createSigner({
    key: JWT_SECRET,
    expiresIn: 15 * 60 * 1000,
    aud: defaultAudience,
  });

  const refreshSigner = createSigner({
    key: JWT_REFRESH_SECRET,
    expiresIn: 30 * 24 * 60 * 60 * 1000,
    aud: defaultAudience,
  });

  const defaultVerifier = createVerifier({
    key: JWT_SECRET,
    allowedAud: defaultAudience,
  });

  fastify.decorate('jwt', ({
    signToken(
      payload: any,
      options?: Partial<SignerOptions & { secret: string }>,
    ) {
      const clean = JSON.parse(JSON.stringify(payload));

      if (options?.secret || options?.expiresIn) {
        const customSigner = createSigner({
          key: options.secret || JWT_SECRET,
          expiresIn: options.expiresIn,
          aud: defaultAudience,
          ...options,
        });
        return customSigner(clean);
      }

      if ('sessionId' in payload && !('userId' in payload)) {
        return refreshSigner(clean);
      }

      return accessSigner(clean);
    },

    verifyToken<T = any>(
      token: string,
      options?: VerifierOptions & { secret?: string },
    ): { payload?: T; error?: string } {
      try {
        const verifier = options?.secret
          ? createVerifier({
              key: options.secret,
              allowedAud: defaultAudience,
              ...options,
            })
          : defaultVerifier;

        return { payload: verifier(token) as T };
      } catch (err: any) {
        return { error: err.message };
      }
    },
  }) as any);

  fastify.decorate(
    'authenticate',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const raw = request.headers.authorization;
        const token = raw?.startsWith('Bearer ')
          ? raw.slice(7)
          : raw;

        if (!token) {
          return reply.code(401).send({ error: 'Missing token' });
        }

        const { payload, error } = (
          fastify.jwt as unknown as {
            verifyToken(token: string): { payload?: any; error?: string };
          }
        ).verifyToken(token);
        if (error || !payload) {
          return reply.code(401).send({ error: error ?? 'Invalid token' });
        }

        request.user = payload;
      } catch (err: any) {
        return reply.code(401).send({ error: err.message });
      }
    },
  );
});
