// src/utils/validateZod.ts
import type { ZodType } from 'zod';

export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: Record<string, string> };

const validateZod = async <T>(
  schema: ZodType<T>,
  input: unknown,
  preprocessor?: (data: unknown) => Promise<unknown> | unknown,
): Promise<ValidationResult<T>> => {
  try {
    const processedInput = preprocessor ? await preprocessor(input) : input;

    // safeParseAsync handles both sync and async Zod transformations cleanly
    const result = await schema.safeParseAsync(processedInput);

    if (result.success) {
      return { success: true, data: result.data };
    }

    const errors = Object.fromEntries(
      result.error.issues.map(({ path, message }) => [
        path.length > 0 ? path.join('.') : '_form',
        message,
      ]),
    );

    return { success: false, errors };
  } catch {
    return {
      success: false,
      errors: { _form: 'Unexpected error during validation.' },
    };
  }
};

export { validateZod };
