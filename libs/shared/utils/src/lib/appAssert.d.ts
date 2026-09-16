import { type HttpStatusCode } from '@domo/types';
import { AppErrorCode } from "@domo/constants";
type AppAssert = (condition: any, httpStatusCode: HttpStatusCode, message: string, appErrorCode?: AppErrorCode) => asserts condition;
/**
 * Asserts a condition and throws an AppError if the condition is falsy.
 */
declare const appAssert: AppAssert;
export { appAssert };
//# sourceMappingURL=appAssert.d.ts.map