// src/utils/typeGuards.ts
import { AppErrorCode } from '@domo/constants';
import type { AccessTokenPayload } from '@domo/types';
import { UNAUTHORIZED } from '@domo/types';
import { AppError } from './AppError';

/** Narrow `payload` from `unknown` to `AccessTokenPayload` in the if-block. */
function assertIsAccessTokenPayload(payload: unknown): asserts payload is AccessTokenPayload {
  if (
    typeof payload !== 'object' ||
    payload === null ||
    typeof (payload as Record<string, unknown>)['userId'] !== 'string' ||
    typeof (payload as Record<string, unknown>)['sessionId'] !== 'string'
  ) {
    throw new AppError(UNAUTHORIZED, 'Malformed token payload', AppErrorCode.InvalidAccessToken);
  }
}

export { assertIsAccessTokenPayload };
