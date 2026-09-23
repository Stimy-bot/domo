// apps/fastify/src/app/plugins/error-handler.ts
import type { FastifyPluginAsync, FastifyError } from 'fastify';
import fp from 'fastify-plugin';
import fs from 'node:fs';
import path from 'node:path';
import { AppError } from '@domo/constants';

const errorHandlerPlugin: FastifyPluginAsync = async (fastify) => {
  const viewsDir = path.resolve(process.cwd(), 'apps/api/src/views');

  fastify.setErrorHandler((error: FastifyError | AppError | Error, request, reply) => {
    // Determine HTTP status code
    let statusCode = 500;
    if ('statusCode' in error && typeof error.statusCode === 'number') {
      statusCode = error.statusCode;
    }

    // 1. Handle Schema Validation Errors (Fastify TypeBox / Ajv)
    if ('validation' in error && error.validation) {
      return reply.status(400).send({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Validation failed',
        details: error.validation,
      });
    }

    // 2. Handle Custom Operational App Errors (e.g., NotFoundError, BadRequestError)
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        statusCode: error.statusCode,
        error: error.name,
        message: error.message,
        ...(error.details ? { details: error.details } : {}),
      });
    }

    // 3. Log Unhandled Server Errors (500s)
    request.log.error(
      {
        err: error,
        reqId: request.id,
        url: request.raw.url,
        method: request.raw.method,
      },
      'Unhandled Server Error',
    );

    // Check if the request comes from a browser expecting HTML
    const acceptsHtml = request.headers.accept?.includes('text/html');
    const serverErrorPage = path.join(viewsDir, '500.html');

    if (acceptsHtml && fs.existsSync(serverErrorPage)) {
      return reply.status(500).type('text/html').send(fs.createReadStream(serverErrorPage));
    }

    // Standard JSON response for APIs / cURL
    const isDev = process.env.NODE_ENV !== 'production';
    return reply.status(statusCode).send({
      statusCode,
      error: error.name || 'Internal Server Error',
      message: isDev ? error.message : 'An internal server error occurred.',
      ...(isDev && { stack: error.stack }),
    });
  });
};

export default fp(errorHandlerPlugin, { name: 'error-handler' });