import { validates } from './validates';
import { describe, it, expect } from 'vitest'

describe('validates', () => {
  it('should work', () => {
    expect(validates()).toEqual('validates');
  });
});
