import fp from 'fastify-plugin';
import fastifyMongo from '@fastify/mongodb';
import type { FastifyInstance, FastifyRequest } from 'fastify';
import type { Db } from 'mongodb';

export default fp(
  async (fastify: FastifyInstance) => {
    const url = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/domo';

    if (!url) {
      fastify.log.error('MONGO_URI environment variable is missing!');
      throw new Error('Missing MONGO_URI configuration');
    }

    const mongoPlugin =
      (fastifyMongo as typeof fastifyMongo & { default?: typeof fastifyMongo }).default ??
      fastifyMongo;

    // 1. Register fastifyMongo plugin
    fastify.register(mongoPlugin, {
      forceClose: true,
      url,
      database: 'totaldata',
    });

    // 2. Wait for fastifyMongo to complete connection & decoration
    await fastify.after();

    // 3. Decorate FastifyRequest prototype with a placeholder
    fastify.decorateRequest('db', null as unknown as Db);

    // 4. Attach the connected Db instance to req.db on every incoming request
    fastify.addHook('onRequest', async (req: FastifyRequest) => {
      const db = fastify.mongo.db;

      if (!db) {
        throw new Error('MongoDB connection is not available');
      }

      req.db = db;
    });

    fastify.log.info('Successfully connected to MongoDB and attached req.db');
  },
  {
    name: 'mongodb',
  }
);