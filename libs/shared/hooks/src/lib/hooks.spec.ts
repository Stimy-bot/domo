import { hooks } from './hooks.js';
import { describe, it, expect } from 'vitest';

describe('hooks', () => {
  it('should work', () => {
    expect(hooks()).toEqual('hooks');
  });
});
