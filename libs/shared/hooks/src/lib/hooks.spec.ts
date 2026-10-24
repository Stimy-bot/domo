import { describe, expect, it } from 'vitest';
import { hooks } from './hooks.js';

describe('hooks', () => {
  it('should work', () => {
    expect(hooks()).toEqual('hooks');
  });
});
