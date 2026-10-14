// apps/fastify/src/app/routes/auth/index.ts
import type { FastifyPluginAsync } from "fastify";
import {
  sendPasswordResetHandler,
  loginHandler,
  logoutHandler,
  refreshHandler,
  registerHandler,
  resetPasswordHandler,
  verifyEmailHandler,
} from "@domo/controllers";

const authRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post("/register", registerHandler);
  fastify.post("/login", loginHandler);
  fastify.get("/refresh", refreshHandler);
  fastify.get("/logout", logoutHandler);
  fastify.get("/email/verify/:code", verifyEmailHandler);
  fastify.post("/password/forgot", sendPasswordResetHandler);
  fastify.post("/password/reset", resetPasswordHandler);
};

export default authRoutes;