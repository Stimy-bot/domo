// apps/api/src/main.ts
import Fastify from 'fastify'
import type { FastifyInstance } from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { lifecycle } from '@domo/utils'
import { loadEnv } from '@domo/constants'
import app, { options } from './app/app'

const server: FastifyInstance = Fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
      },
    },
  },
  ...options,
})
  .setValidatorCompiler(validatorCompiler)
  .setSerializerCompiler(serializerCompiler)
  .withTypeProvider<ZodTypeProvider>()

// Load environment variables via helper
const env = loadEnv()

process.on('unhandledRejection', (r) => {
  console.error('UNHANDLED REJECTION', r)
  try { server.log.error(r as Error) } catch {
    console.error('>>> failed to log unhandled rejection')
  }
})

process.on('uncaughtException', (e) => {
  console.error('UNCAUGHT EXCEPTION', e)
  try { server.log.error(e as Error) } catch {
    console.error('>>> failed to log uncaught exception')
  }
})

// 1. Register Fastify server closing with the lifecycle manager
lifecycle.register(async () => {
  console.log('>>> closing Fastify server...')
  await server.close()
  console.log('>>> Fastify server closed cleanly')
})

// 2. Attach process signals to trigger the lifecycle shutdown
const handleShutdown = async (signal: string) => {
  console.log(`>>> received signal ${signal}, starting graceful shutdown`)
  
  const timer = setTimeout(() => {
    console.error('>>> shutdown timed out, forcing exit')
    process.exit(1)
  }, 10000)

  try {
    await lifecycle.shutdown()
    clearTimeout(timer)
    process.exit(0)
  } catch (err) {
    console.error('>>> error during lifecycle shutdown:', err)
    clearTimeout(timer)
    process.exit(1)
  }
}

process.on('SIGINT', () => handleShutdown('SIGINT'))
process.on('SIGTERM', () => handleShutdown('SIGTERM'))

// 3. Bootstrapping sequence inside an async IIFE wrapper
async function start() {
  console.log('>>> start: registering app plugin')
  await server.register(app)
  console.log('>>> app plugin registered')

  console.log('>>> waiting for server.ready()')
  await server.ready()
  console.log('>>> server ready')

  const port = parseInt(env?.SERVER_PORT || process.env.SERVER_PORT || '5000', 10)
  const host = env?.HOST || process.env.HOST || '0.0.0.0'

  try {
    await server.listen({ port, host })
    console.log(`>>> listening on ${host}:${port}`)
  } catch (err) {
    console.error('>>> listen failed', err)
    server.log.error(err as Error)
    
    await lifecycle.shutdown()
    process.exit(1)
  }
}

start()