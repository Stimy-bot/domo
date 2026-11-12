// libs/shared/utils/src/lib/appAssert.ts

import type { AppErrorCode } from '@domo/constants';
import type { HttpStatusCode } from '@domo/types';
import { AppError } from './AppError';

type AppAssert = (
  condition: unknown,
  httpStatusCode: HttpStatusCode,
  message: string,
  appErrorCode?: AppErrorCode,
) => asserts condition;

const appAssert: AppAssert = (condition, httpStatusCode, message, appErrorCode) => {
  if (!condition) {
    throw new AppError(httpStatusCode, message, appErrorCode);
  }
};

export { appAssert };
