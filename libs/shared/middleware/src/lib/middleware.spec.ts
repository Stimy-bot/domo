import { middleware } from './middleware.js';
import { describe, it, expect } from 'vitest';

describe('middleware', () => {
  it('should work', () => {
    expect(middleware()).toEqual('middleware');
  });
});
