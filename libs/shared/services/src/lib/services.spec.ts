import { describe, expect, it } from 'vitest';
import { services } from './services.js';

describe('services', () => {
  it('should work', () => {
    expect(services()).toEqual('services');
  });
});
