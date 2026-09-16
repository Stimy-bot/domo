import type { CookieSerializeOptions } from "@fastify/cookie";
import type { FastifyReply } from "fastify";
export declare const REFRESH_PATH = "/api/refresh";
export declare const getAccessTokenCookieOptions: () => CookieSerializeOptions;
export declare const getRefreshTokenCookieOptions: () => CookieSerializeOptions;
type Params = {
    reply: FastifyReply;
    accessToken: string;
    refreshToken: string;
};
export declare const setAuthCookies: ({ reply, accessToken, refreshToken }: Params) => FastifyReply<import("fastify").RouteGenericInterface, import("fastify").RawServerDefault, import("http").IncomingMessage, import("http").ServerResponse<import("http").IncomingMessage>, unknown, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown>;
export declare const clearAuthCookies: (reply: FastifyReply) => FastifyReply<import("fastify").RouteGenericInterface, import("fastify").RawServerDefault, import("http").IncomingMessage, import("http").ServerResponse<import("http").IncomingMessage>, unknown, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown>;
export {};
//# sourceMappingURL=cookies.d.ts.map