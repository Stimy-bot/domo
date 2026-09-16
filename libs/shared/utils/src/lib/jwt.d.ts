import { SignerOptions, VerifierOptions } from 'fast-jwt';
export declare const ROLES: readonly ["user", "admin", "superAdmin"];
export type RoleType = (typeof ROLES)[number];
export type AccessTokenPayload = {
    userId: string;
    sessionId: string;
    role: RoleType[];
    isAdmin: boolean;
    email: string;
    fullName: string;
};
export type RefreshTokenPayload = {
    sessionId: string;
};
export type SignOptionsAndSecret = SignerOptions & {
    secret: string;
};
/**
 * Signs a token using fast-jwt signers.
 */
export declare const signToken: (payload: AccessTokenPayload | RefreshTokenPayload, options?: Partial<SignOptionsAndSecret>) => string;
/**
 * Verifies a token and returns payload or error string.
 */
export declare const verifyToken: <TPayload extends object = AccessTokenPayload>(token: string, options?: VerifierOptions & {
    secret?: string;
}) => {
    payload?: TPayload;
    error?: string;
};
/**
 * Helper to create both access and refresh tokens.
 */
export declare const createSessionAndTokens: (userId: string, role: RoleType[], email: string, fullName: string, sessionId: string) => {
    accessToken: string;
    refreshToken: string;
};
//# sourceMappingURL=jwt.d.ts.map