import { z } from 'zod';
import { ObjectId } from 'mongodb';
export declare const auditLogDocumentSchema: z.ZodObject<{
    _id: z.ZodCustom<ObjectId, ObjectId>;
    type: z.ZodString;
    actor: z.ZodAny;
    target: z.ZodAny;
    metadata: z.ZodAny;
    ip: z.ZodString;
    createdAt: z.ZodDate;
}, z.core.$strip>;
export type AuditLogDocument = z.infer<typeof auditLogDocumentSchema>;
export declare const auditLogInsertSchema: z.ZodObject<{
    type: z.ZodString;
    ip: z.ZodString;
    actor: z.ZodAny;
    target: z.ZodAny;
    metadata: z.ZodAny;
    createdAt: z.ZodDate;
}, z.core.$strip>;
export type AuditLogInsert = z.infer<typeof auditLogInsertSchema>;
//# sourceMappingURL=auditMongoSchema.d.ts.map