import { describe, expect, it } from 'vitest';
import { error } from './error.js';

describe('shared', () => {
  it('should work', () => {
    expect(error()).toEqual('error');
  });
});
