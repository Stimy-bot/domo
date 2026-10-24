import { describe, expect, it } from 'vitest';
import { context } from './context.js';

describe('context', () => {
  it('should work', () => {
    expect(context()).toEqual('context');
  });
});
