import { describe, expect, it } from 'vitest';
import { validates } from './validates.js';

describe('validates', () => {
  it('should work', () => {
    expect(validates()).toEqual('validates');
  });
});
