import { ZodType } from "zod";
export type ValidationResult<T> = {
    success: true;
    data: T;
} | {
    success: false;
    errors: Record<string, string>;
};
declare const validateZod: <T>(schema: ZodType<T>, input: unknown, preprocessor?: (data: unknown) => Promise<unknown> | unknown) => Promise<ValidationResult<T>>;
export { validateZod };
//# sourceMappingURL=validateZod.d.ts.map