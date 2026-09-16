/**
 * Normalizes an IP string by trimming and converting IPv6 localhost to IPv4.
 */
export declare function normalizeIp(raw: unknown): string;
/**
 * Validates IPv4 and IPv6 addresses using Regular Expressions.
 * Replaces the need for 'node:net' in the browser.
 */
export declare function isValidIp(ip: string): boolean;
/**
 * Combines normalization and validation.
 */
export declare function normalizeAndValidateIp(raw: unknown): string;
//# sourceMappingURL=ip.d.ts.map