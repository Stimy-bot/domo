import type { AppErrorCode } from '@domo/constants';
import type { HttpStatusCode } from '@domo/types';

class AppError extends Error {
  constructor(
    public statusCode: HttpStatusCode,
    public override message: string,
    public errorCode?: AppErrorCode,
  ) {
    super(message);
  }
}

export { AppError };
