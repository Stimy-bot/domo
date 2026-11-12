// apps/my_fastify/src/app/routes/auth/index.ts
import {
  googleCallbackHandler,
  loginHandler,
  logoutHandler,
  refreshHandler,
  registerHandler,
  resetPasswordHandler,
  sendPasswordResetHandler,
  verifyEmailHandler,
} from '@domo/controllers';
import type { FastifyPluginAsync } from 'fastify';

const authRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post('/register', registerHandler);
  fastify.post('/login', loginHandler);
  fastify.get('/refresh', refreshHandler);
  fastify.get('/logout', logoutHandler);
  fastify.get('/email/verify/:code', verifyEmailHandler);
  fastify.post('/password/forgot', sendPasswordResetHandler);
  fastify.post('/password/reset', resetPasswordHandler);
  fastify.get('/google/callback', googleCallbackHandler);
};

export { authRoutes };
