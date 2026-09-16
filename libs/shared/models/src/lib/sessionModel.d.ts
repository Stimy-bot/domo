import { ObjectId, type Db } from 'mongodb';
export interface SessionInput {
    userId: ObjectId;
    userAgent?: string;
    ip?: string;
    expiresAt?: Date;
}
export interface SessionEntity {
    _id?: ObjectId;
    userId: ObjectId;
    userAgent?: string;
    ip?: string;
    createdAt: Date;
    expiresAt: Date;
}
export type RefreshTokenPayload = {
    sessionId: string;
};
export declare function getRefreshToken(sessionId: ObjectId | string): string;
export declare function buildSessionDocument(input: SessionInput): Omit<SessionEntity, '_id'>;
export declare function ensureSessionIndexes(db: Db): Promise<void>;
//# sourceMappingURL=sessionModel.d.ts.map