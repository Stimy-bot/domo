export function utils(): string {
  return 'utils';
}

export const isString = (value: unknown): value is string =>
  typeof value === 'string';
