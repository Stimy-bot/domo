export declare class AppError extends Error {
    readonly statusCode: number;
    readonly details?: unknown;
    constructor(message: string, statusCode?: number, details?: unknown);
}
export declare class NotFoundError extends AppError {
    constructor(message?: string);
}
export declare class BadRequestError extends AppError {
    constructor(message?: string, details?: unknown);
}
export declare class UnauthorizedError extends AppError {
    constructor(message?: string);
}
export declare class ConflictError extends AppError {
    constructor(message?: string);
}
declare const errors: {
    AppError: typeof AppError;
    NotFoundError: typeof NotFoundError;
    BadRequestError: typeof BadRequestError;
    UnauthorizedError: typeof UnauthorizedError;
    ConflictError: typeof ConflictError;
};
export default errors;
//# sourceMappingURL=errors.d.ts.map