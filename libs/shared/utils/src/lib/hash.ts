// libs/shared-utils/src/lib/hash.ts
import { randomBytes, scrypt as _scrypt, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

const SALT_BYTES = 16;
const KEY_LEN = 64; // bytes

export async function hashValue(value: string): Promise<string> {
  const salt = randomBytes(SALT_BYTES).toString('hex');
  const derived = (await scrypt(value, salt, KEY_LEN)) as Buffer;
  return `${salt}:${derived.toString('hex')}`;
}

export async function compareValue(value: string, stored: string): Promise<boolean> {
  const [salt, keyHex] = stored.split(':');
  if (!salt || !keyHex) return false;
  const derived = (await scrypt(value, salt, KEY_LEN)) as Buffer;
  const key = Buffer.from(keyHex, 'hex');
  if (derived.length !== key.length) return false;
  return timingSafeEqual(derived, key);
}
