import { config } from './config';
import { describe, it, expect } from 'vitest';

describe('config', () => {
  it('should work', () => {
    expect(config()).toEqual('config');
  });
});
