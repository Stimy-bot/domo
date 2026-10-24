// client/src/schemas/auditSchema.ts
import { z } from 'zod';
import { userRefSchema } from './auditLogSchema.js';
import { ipAddressSchema, objectIdSchema } from './primitives.js';

// --- 1. Primitive Schemas ---
// Use .nullish() because historical data often lacks IPs or has malformed strings

// export const objectIdSchema = z
//   .string()
//   .regex(/^[0-9a-fA-F]{24}$/, 'Invalid Mongo ObjectId');

export const isoDateSchema = z.preprocess(
  arg => (typeof arg === 'string' ? new Date(arg) : arg),
  z.date(),
);

// --- 2. Reusable User Reference ---
// Made resilient: actor/target might be missing email or name in old logs

// export const userRefSchema = z.preprocess((val: any) => {
//   // If the object has 'id' but no '_id', move it to '_id'
//   if (val && val.id && !val._id) {
//     return { ...val, _id: val.id };
//   }
//   return val;
// }, z.object({
//   _id: objectIdSchema,
//   email: z.string().email().nullish(),
//   fullName: z.string().nullish(),
// }));

// --- 3. Event Types ---
export const auditEventTypes = [
  'role_change',
  'account_deletion',
  'user_login',
  'user_logout',
  'user_register',
  'email_verification',
  'password_reset',
  'custom_event',
  'user_update',
  'user_get_profile',
  'create_company',
  'update_company',
  'delete_company',
  'user_status_change',
  'dashboard_visit',
  'user_login_failed',
] as const;

export const auditEventTypeSchema = z.enum(auditEventTypes);
export type AuditEventType = z.infer<typeof auditEventTypeSchema>;

// --- 4. Shared Base Fields ---
// Defining these here allows us to use .extend() for better TS inference
export const baseLogFields = z.object({
  _id: objectIdSchema,
  actor: userRefSchema.nullish(),
  target: userRefSchema.nullish(),
  createdAt: isoDateSchema,
  ip: ipAddressSchema,
});

// --- 5. Event-Specific Metadata Schemas ---
export const dashboardVisitMetadataSchema = z.object({
  path: z.string().min(1),
  referrer: z.string().url().nullish(),
  section: z.string().nullish(),
  role: z.union([z.string(), z.array(z.string())]).nullish(),
  effectiveRoles: z.array(z.string()).nullish(),
  userAgent: z.string().nullish(),
  ip: z.string().nullish(),
  timestamp: z.string().nullish(),
});

export const roleChangeMetadataSchema = z.object({
  previousRole: z.string().nullish(),
  newRole: z.string().nullish(),
});

export const userLoginMetadataSchema = z
  .object({
    method: z.enum(['password', 'oauth', 'magic_link', 'user_login_failed']).default('password'),
    success: z.boolean().default(true),
    ipAddress: ipAddressSchema,
    userAgent: z.string().nullish(),
  })
  .catchall(z.any());

export const userUpdateMetadataSchema = z
  .object({
    fieldsChanged: z.array(z.string()).nullish(),
  })
  .catchall(z.any());

export const emailVerificationMetadataSchema = z.object({
  method: z.union([z.literal('link'), z.literal('code'), z.literal('link_click')]).nullish(),
  verificationId: z.string().nullish(),
  email: z.string().email().nullish(),
});

export const updateCompanyMetadataSchema = z
  .object({
    fieldsChanged: z.array(z.string()).nullish(),
    companyId: objectIdSchema,
  })
  .catchall(z.any());

export const customEventMetadataSchema = z.record(z.string(), z.any());

// Fallback Map for all types
export const auditEventMetadataMap: Record<AuditEventType, z.ZodTypeAny> = {
  dashboard_visit: dashboardVisitMetadataSchema,
  role_change: roleChangeMetadataSchema,
  account_deletion: z.object({ reason: z.string().nullish() }),
  user_login: userLoginMetadataSchema,
  user_logout: z.object({ ipAddress: ipAddressSchema }),
  user_register: z.object({ referralCode: z.string().nullish(), source: z.string().nullish() }),
  email_verification: emailVerificationMetadataSchema,
  password_reset: z.object({ method: z.string().nullish() }),
  custom_event: customEventMetadataSchema,
  user_get_profile: z.object({ viewedBy: userRefSchema.nullish() }),
  user_update: userUpdateMetadataSchema,
  user_login_failed: z.object({
    method: z.string().default('password'),
    success: z.literal(false).default(false),
    ipAddress: ipAddressSchema,
    reason: z.string().nullish(),
  }),
  create_company: z.object({ companyName: z.string().nullish() }),
  update_company: updateCompanyMetadataSchema,
  delete_company: z.object({ companyId: objectIdSchema, reason: z.string().nullish() }),
  user_status_change: z.object({ previousStatus: z.string(), newStatus: z.string() }),
};

// --- 6. Helper & Discriminated Union ---
function makeLogVariant<T extends AuditEventType>(type: T, metadata: z.ZodTypeAny) {
  return z
    .object({
      type: z.literal(type),
      metadata: metadata,
    })
    .merge(baseLogFields) // This ensures _id and createdAt are explicitly part of the type
    .catchall(z.any());
}

const auditLogVariants = (Object.keys(auditEventMetadataMap) as AuditEventType[]).map(type =>
  makeLogVariant(type, auditEventMetadataMap[type]),
);

export const auditLogSchema = z.discriminatedUnion(
  'type',
  auditLogVariants as [(typeof auditLogVariants)[number], ...(typeof auditLogVariants)[number][]],
);

export const auditLogListSchema = z.array(auditLogSchema);
export type AuditLog = z.infer<typeof auditLogSchema>;

// --- 7. Create Input Schema ---
const createAuditLogVariants = (Object.keys(auditEventMetadataMap) as AuditEventType[]).map(type =>
  z.object({
    type: z.literal(type),
    metadata: auditEventMetadataMap[type],
    actor: userRefSchema.nullish(),
    target: userRefSchema.nullish(),
  }),
);

export const createAuditLogInputSchema = z.discriminatedUnion(
  'type',
  createAuditLogVariants as [
    (typeof createAuditLogVariants)[number],
    ...(typeof createAuditLogVariants)[number][],
  ],
);

export type CreateAuditLogInput = z.infer<typeof createAuditLogInputSchema>;
