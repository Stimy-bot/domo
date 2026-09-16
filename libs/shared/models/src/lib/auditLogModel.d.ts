import { ObjectId, type Db } from 'mongodb';
export interface UserRefInput {
    _id: ObjectId | string;
    email?: string;
    fullName?: string;
}
export interface UserRef {
    _id: ObjectId;
    email?: string;
    fullName?: string;
}
export interface AuditLogInput {
    type: string;
    actor?: UserRefInput | null;
    target?: UserRefInput | null;
    ip?: string;
    metadata?: Record<string, unknown>;
}
export interface AuditLogEntity {
    _id: ObjectId;
    type: string;
    actor: UserRef | null;
    target: UserRef | null;
    ip: string;
    metadata: Record<string, unknown>;
    createdAt: Date;
    updatedAt: Date;
}
export interface SafeUserRef {
    _id: string;
    email?: string;
    fullName?: string;
}
export type SafeAuditLog = Omit<AuditLogEntity, '_id' | 'actor' | 'target'> & {
    _id: string;
    actor: SafeUserRef | null;
    target: SafeUserRef | null;
};
export declare function buildUserRef(userRef?: UserRefInput | null): UserRef | null;
export declare function sanitizeUserRef(userRef?: UserRef | null): SafeUserRef | null;
export declare function sanitizeAuditLog(log: AuditLogEntity): SafeAuditLog;
export declare function buildAuditLogDocument(input: AuditLogInput): Omit<AuditLogEntity, '_id'>;
export declare function ensureAuditLogIndexes(db: Db): Promise<void>;
//# sourceMappingURL=auditLogModel.d.ts.map