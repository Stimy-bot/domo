import { jwtDecode } from 'jwt-decode';

export interface DecodedToken {
  userId: string;
  email: string;
  exp: number;
}

/**
 * Decode JWT payload on client side (Does NOT verify signature)
 */
export function decodeClientToken(token: string): DecodedToken | null {
  try {
    return jwtDecode<DecodedToken>(token);
  } catch {
    return null;
  }
}

/**
 * Check if a token is expired on the client side
 */
export function isTokenExpired(token: string): boolean {
  const decoded = decodeClientToken(token);
  if (!decoded || !decoded.exp) return true;
  return Date.now() >= decoded.exp * 1000;
}
