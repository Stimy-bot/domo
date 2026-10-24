// src/schemas/shared.ts

import validator from 'validator';
import { z } from 'zod';

export const ipAddressSchema = z.preprocess(
  val => {
    if (typeof val === 'string' && val.includes(',')) {
      return val.split(',')[0]?.trim() ?? '';
    }
    // Handle the "::ffff:" prefix Docker sometimes adds
    if (typeof val === 'string' && val.startsWith('::ffff:')) {
      return val.replace('::ffff:', '');
    }
    return val;
  },
  z
    .string()
    .refine(
      ip => {
        // Relaxed check: as long as it's a valid IP, "unknown", or looks like a local Docker IP
        return (
          validator.isIP(ip) || ip === 'unknown' || ip === '127.0.0.1' || ip.startsWith('172.')
        );
      },
      { message: 'Invalid IP address' },
    )
    .optional()
    .or(z.literal('unknown')), // Fallback so it never crashes the app
);

export const arraysEqual = (a: string[], b: string[]): boolean => {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort();
  const sortedB = [...b].sort();
  for (let i = 0; i < sortedA.length; i++) {
    if (sortedA[i] !== sortedB[i]) return false;
  }
  return true;
};
