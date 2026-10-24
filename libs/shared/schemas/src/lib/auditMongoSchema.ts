// libs/shared/schemas/src/lib/auditMongoSchema.ts

import { ObjectId } from 'bson';
import { z } from 'zod';

// Schema for documents fetched from MongoDB
export const auditLogDocumentSchema = z.object({
  _id: z.instanceof(ObjectId),
  type: z.string(),
  actor: z.any(),
  target: z.any(),
  metadata: z.any(),
  ip: z.string(),
  createdAt: z.date(),
});

// 2) Type alias for documents you read back from Mongo
export type AuditLogDocument = z.infer<typeof auditLogDocumentSchema>;

// 3) Insert shape (no _id yet)
export const auditLogInsertSchema = auditLogDocumentSchema.omit({ _id: true });
export type AuditLogInsert = z.infer<typeof auditLogInsertSchema>;
