// libs/shared/schemas/src/lib/auditLogSchema.ts
import { type ZodObject, type ZodRawShape, z } from 'zod';
import {
  ipAddressSchema,
  isoDateStringSchema,
  objectIdSchema,
  optionalTrimmedString,
} from './primitives.js';

//
// 1. Shared Sub-Schemas
//
export const userRefSchema = z.object({
  _id: objectIdSchema.optional(),
  email: optionalTrimmedString,
  fullName: optionalTrimmedString,
});

//
// 2. Audit Event Type Enum (no duplicates)
//
export const auditEventTypeSchema = z.enum([
  'role_change',
  'user_register',
  'account_deletion',
  'user_login',
  'user_logout',
  'email_verification',
  'password_reset',
  'custom_event',
  'user_get_profile',
  'user_update',
  'user_login_failed',
  'create_company',
  'update_company',
  'delete_company',
  'user_status_change',
  'all_accounts_deletion',
  'dashboard_visit',
  'otp_verification',
  'otp_request',
  'otp_failed',
  'otp_resend',
  'sms_delivery_callback',
  'user_register_conflict',
] as const);
export type AuditEventType = z.infer<typeof auditEventTypeSchema>;

//
// 3. Per-Event Metadata Schemas (use objectIdSchema for id fields)
//

export const otp_resendMetadataSchema = z
  .object({
    method: z.enum(['manual', 'timeout', 'forced']),
  })
  .catchall(z.unknown());

export const otp_failedMetadataSchema = z.object({
  method: z.enum(['manual', 'timeout', 'forced']),
  sessionId: z.string().optional(),
});

export const otpRequestMetadataSchema = z.object({
  method: z.enum(['manual', 'timeout', 'forced']),
  sessionId: z.string().optional(),
  phone: z.string().optional(), // Add this
});

export const smsDeliveryCallbackMetadataSchema = z.object({
  status: z.string(),
  deliveryId: z.string(),
  phoneNumber: z.string(),
  message: z.string().optional(),
  error: z.string().optional(),
  timestamp: z.string().optional(),
});

export const dashboardVisitMetadataSchema = z.object({
  path: z.string().optional(),
  location: z.string().optional(),
  referrer: z.string().optional().or(z.literal('')),
  section: z.string().optional(),
  role: z.union([z.string(), z.array(z.string())]).optional(),
  effectiveRoles: z.array(z.string()).optional(),
  userAgent: z.string().optional(),
  ip: z.string().optional(),
  timestamp: z.string().optional(),
});

export const userRegisterConflictMetadataSchema = z.object({
  email: z.string().email(),
  existingUserId: objectIdSchema.optional(),
  existingUserEmail: z.string().email().optional(),
  existingUserFullName: z.string().optional(),
  attemptedUserAgent: z.string().optional(),
  attemptedIp: z.string().optional(),
});

export const roleChangeMetadataSchema = z.object({
  previousRole: z.string(),
  newRole: z.string(),
  changedBy: objectIdSchema,
});

export const accountDeletionMetadataSchema = z.object({
  reason: z.enum(['user_request', 'admin_action', 'inactivity']),
  deletedBy: objectIdSchema,
});

export const userLoginMetadataSchema = z.object({
  method: z.enum(['password', 'oauth', 'user_login_failed', 'magic_link']),
  userAgent: z.string().optional(),
  success: z.boolean(),
});

export const userLogoutMetadataSchema = z.object({
  method: z.enum(['manual', 'timeout', 'forced']),
  sessionId: z.string().optional(),
});

export const userRegisterMetadataSchema = z.object({
  method: z.enum(['manual', 'oauth', 'invite', 'sms']),
  sessionId: z.string().optional(),
});

export const emailVerificationMetadataSchema = z.object({
  method: z.enum(['link_click', 'code_entry']),
  verificationId: z.string(),
  email: z.string().email(),
});

export const passwordResetMetadataSchema = z.object({
  resetMethod: z.enum(['email', 'sms']),
  resetToken: z.string(),
  success: z.boolean(),
});

export const userUpdateMetadataSchema = z.object({
  method: z.enum(['manual', 'oauth', 'link_click', 'webhook', 'sms', 'passwordless']),
  sessionId: z.string().optional(),
  success: z.boolean().optional(),
});

export const customEventMetadataSchema = z.record(z.string(), z.any());

export const userGetProfileMetadataSchema = z.object({
  success: z.boolean(),
});

export const createCompanyMetadataSchema = z.object({
  companyName: z.string(),
  companyId: objectIdSchema,
});

export const updateCompanyMetadataSchema = z.object({
  companyId: objectIdSchema,
  updatedFields: z.array(z.string()),
});

export const deleteCompanyMetadataSchema = z.object({
  companyId: objectIdSchema,
  companyName: z.string(),
});

export const userStatusChangeMetadataSchema = z.object({
  previousStatus: z.boolean().optional(),
  newStatus: z.boolean().optional(),
  changedBy: objectIdSchema.optional(),
  reason: z.string().optional(),
});

export const allAccountsDeletionMetadataSchema = z.object({
  method: z.string().optional(), // e.g. 'manual'
  success: z.boolean(),
  reason: z.string().optional(),
  deletedCount: z.number(),
});

export const otpVerificationMetadataSchema = z.object({
  method: z.string().optional(), // e.g. 'manual'
  success: z.boolean(),
  reason: z.string().optional(),
});

export type DashboardVisitMetadata = z.infer<typeof dashboardVisitMetadataSchema>;

export type UserLoginMetadata = z.infer<typeof userLoginMetadataSchema>;

//
// 4. Base event (actor/target optional). ip optional to allow internal/system events.
//
const baseEvent = z.object({
  actor: userRefSchema.optional(),
  target: userRefSchema.optional(),
  ip: ipAddressSchema.optional(),
});

//
// 5. Create (input) schemas using a helper to reduce repetition
//
// Replace your makeCreate with this
const makeCreate = (typeLiteral: AuditEventType, metaSchema: z.ZodType) =>
  z
    .object({
      type: z.literal(typeLiteral),
      metadata: metaSchema,
    })
    .extend(baseEvent.shape);

export const createAuditLogInputSchema = z.discriminatedUnion('type', [
  makeCreate('user_register_conflict', userRegisterConflictMetadataSchema),
  makeCreate('otp_resend', otp_resendMetadataSchema),
  makeCreate('otp_failed', otp_failedMetadataSchema),
  makeCreate('sms_delivery_callback', smsDeliveryCallbackMetadataSchema),
  makeCreate('otp_request', otpRequestMetadataSchema),
  makeCreate('otp_verification', otpVerificationMetadataSchema),
  makeCreate('user_get_profile', userGetProfileMetadataSchema),
  makeCreate('role_change', roleChangeMetadataSchema),
  makeCreate('account_deletion', accountDeletionMetadataSchema),
  makeCreate('user_login', userLoginMetadataSchema),
  makeCreate('user_login_failed', userLoginMetadataSchema),
  makeCreate('user_logout', userLogoutMetadataSchema),
  makeCreate('user_register', userRegisterMetadataSchema),
  makeCreate('email_verification', emailVerificationMetadataSchema),
  makeCreate('password_reset', passwordResetMetadataSchema),
  makeCreate('user_update', userUpdateMetadataSchema),
  makeCreate('custom_event', customEventMetadataSchema),
  makeCreate('create_company', createCompanyMetadataSchema),
  makeCreate('update_company', updateCompanyMetadataSchema),
  makeCreate('delete_company', deleteCompanyMetadataSchema),
  makeCreate('user_status_change', userStatusChangeMetadataSchema),
  makeCreate('all_accounts_deletion', allAccountsDeletionMetadataSchema),
  makeCreate('dashboard_visit', dashboardVisitMetadataSchema),
]);

export type CreateAuditLogInput = z.infer<typeof createAuditLogInputSchema>;

//
// 6. Full Audit Log Schemas (adds _id & createdAt)
//
const withMeta = <T extends ZodObject<ZodRawShape>>(schema: T) =>
  schema.extend({
    _id: objectIdSchema,
    createdAt: isoDateStringSchema,
  });

export const auditLogSchema = z.discriminatedUnion('type', [
  withMeta(
    z
      .object({
        type: z.literal('user_register_conflict'),
        metadata: userRegisterConflictMetadataSchema,
      })
      .extend(baseEvent.shape),
  ),
  withMeta(
    z
      .object({ type: z.literal('otp_resend'), metadata: otp_resendMetadataSchema })
      .extend(baseEvent.shape),
  ),
  withMeta(
    z
      .object({ type: z.literal('otp_failed'), metadata: otp_failedMetadataSchema })
      .extend(baseEvent.shape),
  ),
  withMeta(
    z
      .object({ type: z.literal('otp_request'), metadata: otpRequestMetadataSchema })
      .extend(baseEvent.shape),
  ),
  withMeta(
    z
      .object({
        type: z.literal('sms_delivery_callback'),
        metadata: smsDeliveryCallbackMetadataSchema,
      })
      .extend(baseEvent.shape),
  ),
  withMeta(
    z
      .object({ type: z.literal('otp_verification'), metadata: otpVerificationMetadataSchema })
      .extend(baseEvent.shape),
  ),
  withMeta(
    z
      .object({ type: z.literal('dashboard_visit'), metadata: dashboardVisitMetadataSchema })
      .extend(baseEvent.shape),
  ),
  withMeta(
    z
      .object({ type: z.literal('user_get_profile'), metadata: userGetProfileMetadataSchema })
      .extend(baseEvent.shape),
  ),
  withMeta(
    z
      .object({ type: z.literal('role_change'), metadata: roleChangeMetadataSchema })
      .extend(baseEvent.shape),
  ),
  withMeta(
    z
      .object({ type: z.literal('account_deletion'), metadata: accountDeletionMetadataSchema })
      .extend(baseEvent.shape),
  ),
  withMeta(
    z
      .object({ type: z.literal('user_login'), metadata: userLoginMetadataSchema })
      .extend(baseEvent.shape),
  ),
  withMeta(
    z
      .object({ type: z.literal('user_login_failed'), metadata: userLoginMetadataSchema })
      .extend(baseEvent.shape),
  ),
  withMeta(
    z
      .object({ type: z.literal('user_logout'), metadata: userLogoutMetadataSchema })
      .extend(baseEvent.shape),
  ),
  withMeta(
    z
      .object({ type: z.literal('user_register'), metadata: userRegisterMetadataSchema })
      .extend(baseEvent.shape),
  ),
  withMeta(
    z
      .object({ type: z.literal('email_verification'), metadata: emailVerificationMetadataSchema })
      .extend(baseEvent.shape),
  ),
  withMeta(
    z
      .object({ type: z.literal('password_reset'), metadata: passwordResetMetadataSchema })
      .extend(baseEvent.shape),
  ),
  withMeta(
    z
      .object({ type: z.literal('user_update'), metadata: userUpdateMetadataSchema })
      .extend(baseEvent.shape),
  ),
  withMeta(
    z
      .object({ type: z.literal('custom_event'), metadata: customEventMetadataSchema })
      .extend(baseEvent.shape),
  ),
  withMeta(
    z
      .object({ type: z.literal('create_company'), metadata: createCompanyMetadataSchema })
      .extend(baseEvent.shape),
  ),
  withMeta(
    z
      .object({ type: z.literal('update_company'), metadata: updateCompanyMetadataSchema })
      .extend(baseEvent.shape),
  ),
  withMeta(
    z
      .object({ type: z.literal('delete_company'), metadata: deleteCompanyMetadataSchema })
      .extend(baseEvent.shape),
  ),
  withMeta(
    z
      .object({ type: z.literal('user_status_change'), metadata: userStatusChangeMetadataSchema })
      .extend(baseEvent.shape),
  ),
  withMeta(
    z
      .object({
        type: z.literal('all_accounts_deletion'),
        metadata: allAccountsDeletionMetadataSchema,
      })
      .extend(baseEvent.shape),
  ),
]);

export type AuditLog = z.infer<typeof auditLogSchema>;
const auditLogEntryPreprocess = z.preprocess(val => {
  if (!val || typeof val !== 'object') return val;
  const entry = { ...val } as Record<string, unknown>;
  // Ensure metadata exists so the Discriminated Union doesn't choke
  entry['metadata'] = entry['metadata'] ?? {};
  return entry;
}, auditLogSchema);

export const auditLogListSchema = z.array(auditLogEntryPreprocess);
export type AuditLogList = z.infer<typeof auditLogListSchema>;

//
// 7. Audit Log Filter Schema
//
export const auditLogFilterSchema = z.object({
  _id: objectIdSchema.optional(),
  actorId: objectIdSchema.optional(),
  targetId: objectIdSchema.optional(),
  type: auditEventTypeSchema.optional(),
  ip: ipAddressSchema.optional(),
  metadata: z.record(z.string(), z.any()).optional(),
  createdAt: z
    .object({
      gt: isoDateStringSchema.optional(),
      gte: isoDateStringSchema.optional(),
      lt: isoDateStringSchema.optional(),
      lte: isoDateStringSchema.optional(),
    })
    .optional(),
  limit: z.coerce.number().int().positive().optional(),
});

export type AuditLogFilter = z.infer<typeof auditLogFilterSchema>;
