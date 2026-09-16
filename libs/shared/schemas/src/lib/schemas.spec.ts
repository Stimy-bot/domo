import { schemas } from './schemas.js';
import { describe, it, expect } from 'vitest';

describe('schemas', () => {
  it('should work', () => {
    expect(schemas()).toEqual('schemas');
  });
});
