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
  getCurrentUserHandler,
} from "@domo/controllers";

const authRoutes: FastifyPluginAsync = async (fastify) => {
  // ------------------------------------
  // PUBLIC ROUTES (No Token Required)
  // ------------------------------------
  fastify.post("/register", registerHandler);
  fastify.post("/login", loginHandler);
  fastify.get("/refresh", refreshHandler);
  fastify.get("/email/verify/:code", verifyEmailHandler);
  fastify.post("/password/forgot", sendPasswordResetHandler);
  fastify.post("/password/reset", resetPasswordHandler);

  // ------------------------------------
  // PROTECTED ROUTES (Requires Valid JWT)
  // ------------------------------------
  fastify.register(async (protectedRoutes) => {
    // Apply authentication hook to all routes in this nested scope
    protectedRoutes.addHook("onRequest", async (request, reply) => {
      try {
        await request.jwtVerify();
      } catch (err) {
        reply.status(401).send({ error: "Unauthorized", message: "Invalid or expired token" });
      }
    });

    protectedRoutes.post("/logout", logoutHandler);
    protectedRoutes.get("/me", getCurrentUserHandler);
  });
};

export { authRoutes };