import assert from 'node:assert';
import type { AppErrorCode } from '@domo/constants';
import type { HttpStatusCode } from '@domo/types';
import { AppError } from './AppError';

type AppAssert = (
  condition: unknown,
  httpStatusCode: HttpStatusCode,
  message: string,
  appErrorCode?: AppErrorCode,
) => asserts condition;
/**
 * Asserts a condition and throws an AppError if the condition is falsy.
 */
const appAssert: AppAssert = (condition, httpStatusCode, message, appErrorCode) =>
  assert(condition, new AppError(httpStatusCode, message, appErrorCode));

export { appAssert };
