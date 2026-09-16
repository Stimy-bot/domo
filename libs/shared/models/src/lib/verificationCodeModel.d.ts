import { ObjectId, type Db } from 'mongodb';
import { VerificationCodeType } from '@domo/constants';
export type VerificationCodeTypeKey = keyof typeof VerificationCodeType;
export interface VerificationCodeInput {
    userId: ObjectId | string;
    target?: string;
    type: VerificationCodeTypeKey;
    code?: string;
    expiresAt: Date | string;
}
export interface VerificationCodeEntity {
    _id: ObjectId;
    userId: ObjectId;
    target?: string;
    type: VerificationCodeTypeKey;
    code?: string;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
export type SafeVerificationCode = Omit<VerificationCodeEntity, '_id' | 'userId'> & {
    _id: string;
    userId: string;
};
export declare function sanitizeVerificationCode(codeDoc: VerificationCodeEntity): SafeVerificationCode;
export declare function buildVerificationCodeDocument(input: VerificationCodeInput): Omit<VerificationCodeEntity, '_id'>;
export declare function ensureVerificationCodeIndexes(db: Db): Promise<void>;
//# sourceMappingURL=verificationCodeModel.d.ts.map