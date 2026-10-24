import { describe, expect, it } from 'vitest';
import { config } from './config';

describe('config', () => {
  it('should work', () => {
    expect(config()).toEqual('config');
  });
});
