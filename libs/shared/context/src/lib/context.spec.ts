import { context } from './context.js';
import { it, describe, expect } from 'vitest'

describe('context', () => {
  it('should work', () => {
    expect(context()).toEqual('context');
  });
});
