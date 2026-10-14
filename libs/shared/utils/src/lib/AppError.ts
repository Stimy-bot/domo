import { AppErrorCode } from "@domo/constants";
import { type HttpStatusCode } from "@domo/constants";

class AppError extends Error {
  constructor(
    public statusCode: HttpStatusCode,
    public override message: string,
    public errorCode?: AppErrorCode
  ) {
    super(message);
  }
}

export  { AppError };