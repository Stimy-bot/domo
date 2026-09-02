import { reusableComponents } from './reusableComponents';
import { describe, expect, it } from 'vitest';

describe('reusableComponents', () => {
  it('should work', () => {
    expect(reusableComponents()).toEqual('reusableComponents');
  });
});
