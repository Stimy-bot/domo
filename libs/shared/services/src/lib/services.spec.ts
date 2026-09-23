import { services } from './services.js';
import { describe, it, expect } from 'vitest'

describe('services', () => {
  it('should work', () => {
    expect(services()).toEqual('services');
  });
});
