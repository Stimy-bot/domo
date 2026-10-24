import { describe, expect, it } from 'vitest';
import { reusableComponents } from './reusableComponents.js';

describe('reusableComponents', () => {
  it('should work', () => {
    expect(reusableComponents()).toEqual('reusableComponents');
  });
});
