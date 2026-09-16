import { z } from 'zod';
export declare const objectIdSchema: z.ZodPreprocess<z.ZodString, unknown>;
export declare const isoDateStringSchema: z.ZodPipe<z.ZodCoercedDate<unknown>, z.ZodTransform<string, Date>>;
export declare const optionalTrimmedString: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
export declare const ipAddressSchema: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
//# sourceMappingURL=primitives.d.ts.map