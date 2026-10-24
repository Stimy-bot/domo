import { describe, expect, it } from 'vitest';
import { utils } from './utils.js';

describe('utils', () => {
  it('should work', () => {
    expect(utils()).toEqual('utils');
  });
});
