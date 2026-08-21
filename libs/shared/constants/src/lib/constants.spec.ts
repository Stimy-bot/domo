import { constants } from './constants';
import { describe, expect, it } from 'vitest';

describe('constants', () => {
  it('should work', () => {
    expect(constants()).toEqual('constants');
  });
});
