import { describe, expect, it } from 'vitest';
import { schemas } from './schemas.js';

describe('schemas', () => {
  it('should work', () => {
    expect(schemas()).toEqual('schemas');
  });
});
