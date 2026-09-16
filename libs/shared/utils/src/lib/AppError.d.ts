import { AppErrorCode } from "@domo/constants";
import { type HttpStatusCode } from "@domo/types";
declare class AppError extends Error {
    statusCode: HttpStatusCode;
    message: string;
    errorCode?: AppErrorCode | undefined;
    constructor(statusCode: HttpStatusCode, message: string, errorCode?: AppErrorCode | undefined);
}
export { AppError };
//# sourceMappingURL=AppError.d.ts.map