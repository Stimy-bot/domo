// src/schemas/primitives.ts
import { z } from 'zod'
import validator from "validator";

export const objectIdSchema = z.preprocess((v) => {
  if (v == null) return undefined
  if (
    typeof v === 'object' &&
    v !== null &&
    'toHexString' in v &&
    typeof v.toHexString === 'function'
  ) {
    return v.toHexString()
  }
  return String(v)
}, z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId'))

export const isoDateStringSchema = z.coerce.date().transform(d => d.toISOString());

export const optionalTrimmedString = z.preprocess(
  (v) => (v === '' || v == null) ? undefined : String(v).trim(),
  z.string().optional()
)

export const ipAddressSchema = z.preprocess(
  (v) => (v === '' || v == null ? undefined : String(v)), // Treat empty string as undefined
  z.string()
    .optional()
    .refine((ip) => ip == null || validator.isIP(ip), { 
      message: 'Invalid IP address' 
    })
)