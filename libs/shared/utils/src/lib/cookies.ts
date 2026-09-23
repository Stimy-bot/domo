// libs/shared/utils/src/lib/cookies.ts
import type { CookieSerializeOptions } from "@fastify/cookie";
import type { FastifyReply } from "fastify";
import { fifteenMinutesFromNow, thirtyDaysFromNow } from "./date.js";

export const REFRESH_PATH = "/api/refresh";
const secure = process.env['NODE_ENV']!== "development";

const defaults: CookieSerializeOptions = {
  sameSite: "strict",
  httpOnly: true,
  secure,
};

export const getAccessTokenCookieOptions = (): CookieSerializeOptions => ({
  ...defaults,
  expires: fifteenMinutesFromNow(),
  path: "/",
});

export const getRefreshTokenCookieOptions = (): CookieSerializeOptions => ({
  ...defaults,
  expires: new Date(thirtyDaysFromNow()),
  path: REFRESH_PATH,
});

type Params = {
  reply: FastifyReply;
  accessToken: string;
  refreshToken: string;
};

export const setAuthCookies = ({ reply, accessToken, refreshToken }: Params) =>
  reply
    .setCookie("accessToken", accessToken, getAccessTokenCookieOptions())
    .setCookie("refreshToken", refreshToken, getRefreshTokenCookieOptions());

export const clearAuthCookies = (reply: FastifyReply) =>
  reply
    .clearCookie("accessToken", { path: "/" })
    .clearCookie("refreshToken", { path: REFRESH_PATH });