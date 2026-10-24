import { describe, expect, it } from 'vitest';
import { constants } from './constants';

describe('constants', () => {
  it('should work', () => {
    expect(constants()).toEqual('constants');
  });
});
