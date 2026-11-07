// libs/shared/utils/src/lib/helper.ts

import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const formatNameToTitle = (snakeCaseStr: string): string => {
  return snakeCaseStr
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const sleep = async (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const required =
  (msg = 'This field is required') =>
  (value: string) =>
    value ? undefined : msg;

export const minLength = (min: number, msg?: string) => (value: string) =>
  value.length >= min ? undefined : (msg ?? `Must be at least ${min} characters`);

export const isEmail =
  (msg = 'Invalid email address') =>
  (value: string) =>
    /\S+@\S+\.\S+/.test(value) ? undefined : msg;

export const passwordStrength =
  (msg = 'Password too weak') =>
  (value: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(value) ? undefined : msg;
  };

export const composeValidators =
  (...validators: ((v: string) => string | undefined)[]) =>
  (value: string): string | undefined => {
    for (const validate of validators) {
      const error = validate(value);
      if (error) return error;
    }
    return undefined;
  };

export const toFieldValidators = (...validators: ((v: string) => string | undefined)[]) => ({
  onChange: composeValidators(...validators),
});

export function isValidUrl(value: string): boolean {
  try {
    // The URL constructor will throw on invalid URLs
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

export type ReturnOf<F> = F extends (...args: unknown[]) => infer R ? R : never;
