// @domo/libs/shared/constants/src/lib/env.ts
import { Type, type Static } from '@sinclair/typebox'
import { Value } from '@sinclair/typebox/value'

const EnvSchema = Type.Object({
  MONGO_URL: Type.String(),
  JWT_SECRET: Type.String(),
  JWT_REFRESH_SECRET: Type.String(),
  COOKIE_SECRET: Type.String(),
  NODE_ENV: Type.Optional(Type.Union([
    Type.Literal('development'),
    Type.Literal('production'),
    Type.Literal('test')
  ])),
  SERVER_PORT: Type.Optional(Type.String()),
  HOST: Type.Optional(Type.String()),
  PORT: Type.Optional(Type.String()),
  APP_ORIGIN: Type.String(),
  EMAIL_SENDER: Type.Optional(Type.String()),
  RESEND_API_KEY: Type.Optional(Type.String()),
  TWILIO_ACCOUNT_SID: Type.Optional(Type.String()),
  TWILIO_AUTH_TOKEN: Type.Optional(Type.String()),
  TWILIO_PHONE_NUMBER: Type.Optional(Type.String()),
  TWILIO_VERIFY_SERVICE_SID: Type.Optional(Type.String()),
  MY_PERSONAL_NUMBER: Type.Optional(Type.String()),
  EMAIL_USER: Type.Optional(Type.String()),
  EMAIL_PASS: Type.Optional(Type.String()),
  SMS_MOCK: Type.Optional(Type.Union([Type.Literal('true'), Type.Literal('false'), Type.Literal('1'), Type.Literal('0')])),
})

type RawEnv = Static<typeof EnvSchema>

export function loadEnv() {
  const ok = Value.Check(EnvSchema, process.env)
  if (!ok) {
    const errors = [...Value.Errors(EnvSchema, process.env)]
    console.error('ENV VALIDATION FAILED:', errors)
    process.exit(1)
  }

  const raw = Value.Cast(EnvSchema, process.env) as unknown as RawEnv

  // Normalize and convert types
  const nodeEnv = raw.NODE_ENV ?? (process.env['NODE_ENV'] ?? 'development')
  const smsMock = raw.SMS_MOCK === 'true' || raw.SMS_MOCK === '1'

  const config = {
    MONGO_URL: raw.MONGO_URL,
    JWT_SECRET: raw.JWT_SECRET,
    JWT_REFRESH_SECRET: raw.JWT_REFRESH_SECRET,
    COOKIE_SECRET: raw.COOKIE_SECRET,
    NODE_ENV: nodeEnv as 'development' | 'production' | 'test',
    SERVER_PORT: raw.SERVER_PORT ?? process.env['SERVER_PORT'],
    HOST: raw.HOST,
    PORT: raw.PORT,
    APP_ORIGIN: raw.APP_ORIGIN,
    EMAIL_SENDER: raw.EMAIL_SENDER,
    RESEND_API_KEY: raw.RESEND_API_KEY,
    TWILIO_ACCOUNT_SID: raw.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN: raw.TWILIO_AUTH_TOKEN,
    TWILIO_PHONE_NUMBER: raw.TWILIO_PHONE_NUMBER,
    TWILIO_VERIFY_SERVICE_SID: raw.TWILIO_VERIFY_SERVICE_SID,
    MY_PERSONAL_NUMBER: raw.MY_PERSONAL_NUMBER,
    EMAIL_USER: raw.EMAIL_USER,
    EMAIL_PASS: raw.EMAIL_PASS,
    SMS_MOCK: smsMock,
    // convenience flags
    isDev: nodeEnv === 'development',
    isProd: nodeEnv === 'production',
    isTest: nodeEnv === 'test',
  }
//TODO Use the returned config where you need  environment-specific behavior: 
/*  
const config = loadEnv()

if (config.isProd) {
  // production-only behavior
}

if (config.SMS_MOCK) {
  // use mock SMS provider
}

*/
  return config
}
