// libs/shared/types/src/lib/audit.ts

import { z } from 'zod';
import { auditLogSchema, userRefSchema } from '@domo/schemas';

// Derive types from your Zod schemas
export type AuditLog = z.infer<typeof auditLogSchema>;
export type Actor = z.infer<typeof userRefSchema>;
export type Target = Actor;

// You can keep the union for convenience if needed elsewhere
export type AuditEventType = AuditLog['type'];