// server/src/config/config.ts
import dotenv from 'dotenv';
import type { MongoClientOptions } from 'mongodb';

if (typeof window === 'undefined') {
  dotenv.config();
}

export const DEVELOPMENT = process.env['NODE_ENV'] === 'development';
export const TEST = process.env['NODE_ENV'] === 'test';

// MongoDB
export const MONGO_USER = process.env['MONGO_USER'] || '';
export const MONGO_PASSWORD = process.env['MONGO_PASSWORD'] || '';
export const MONGO_DATABASE = process.env['MONGO_DATABASE'] || '';
const rawMongoUrl = process.env['MONGO_URL'] || '';

// Native MongoDB Driver Options
export const MONGO_OPTIONS: MongoClientOptions = {
  retryWrites: true,
  w: 'majority',
};

// --- CONNECTION STRING BUILDER ---
const getMongoConnection = (): string => {
  if (TEST) return '';

  // 1. Full URI provided directly
  if (rawMongoUrl.startsWith('mongodb')) return rawMongoUrl;

  // 2. Atlas / Cluster URL construction
  const isAtlas = rawMongoUrl.includes('mongodb.net');
  const user = encodeURIComponent(MONGO_USER);
  const pass = encodeURIComponent(MONGO_PASSWORD);

  const cleanUrl = isAtlas ? rawMongoUrl.split(':')[0] : rawMongoUrl;

  if (isAtlas) {
    return `mongodb+srv://${user}:${pass}@${cleanUrl}/${MONGO_DATABASE}`;
  }

  // Local MongoDB default connection string
  return `mongodb://${user}:${pass}@${cleanUrl || 'localhost'}:27017/${MONGO_DATABASE}`;
};

export const MONGO_CONNECTION = getMongoConnection();

export const mongo = {
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_URL: rawMongoUrl,
  MONGO_DATABASE,
  MONGO_OPTIONS,
  MONGO_CONNECTION,
};

export const SERVER_HOSTNAME = process.env['SERVER_HOSTNAME'] || 'localhost';
export const SERVER_PORT = process.env['SERVER_PORT'] ? Number(process.env['SERVER_PORT']) : 12345;

export const server = {
  SERVER_HOSTNAME,
  SERVER_PORT,
};

// Application Config
export const configs = {
  RESEND_API_KEY: process.env['RESEND_API_KEY'],
  GMAIL: process.env['GMAIL'],
  USER: process.env['USER'],
  PASS: process.env['PASS'],
  EMAIL: 'delivered@resend.dev',
  HOST: 'smtp.resend.com',
  GMAILPORT: process.env['GMAILPORT'],
  GMAILHOST: process.env['GMAILHOST'],
  MAILPORT: 465,
  YOURNAME: 'Dominic Patrick',
  YOURSITE: 'www.yoursite.com',
  GMAILPASS: process.env['GMAILPASS'],
  JWT_ACCESS_SECRET: process.env['JWT_ACCESS_SECRET'],
  JWT_REFRESH_SECRET: process.env['JWT_REFRESH_SECRET'],
  ACCESS_TOKEN_EXPIRES_IN: '15m',
  REFRESH_TOKEN_EXPIRES_IN: '7d',
  MY_PERSONAL_NUMBER: process.env['MY_PERSONAL_NUMBER'] || '',
  TWILIO_ACCOUNT_SID: process.env['TWILIO_ACCOUNT_SID'],
  TWILIO_AUTH_TOKEN: process.env['TWILIO_AUTH_TOKEN'],
  TWILIO_PHONE_NUMBER: process.env['TWILIO_PHONE_NUMBER'],
  TWILIO_VERIFY_SERVICE_SID: process.env['TWILIO_VERIFY_SERVICE_SID'],

  // SMS
  SMS_MOCK: process.env['SMS_MOCK'] || false,

  mail: {
    host: process.env['MAIL_HOST'] || process.env['GMAILHOST'] || 'smtp.gmail.com',
    port: Number(process.env['MAIL_PORT'] || process.env['GMAILPORT']) || 587,
    user: process.env['MAIL_USER'] || process.env['GMAIL'] || '',
    pass: process.env['MAIL_PASSWORD'] || process.env['GMAILPASS'] || '',
    fromName: process.env['MAIL_FROM_NAME'] || 'Support',
  },
};

export const carrierGateway: Record<string, string> = {
  att: 'txt.att.net',
  verizon: 'vtext.com',
  tmobile: 'tmomail.net',
};