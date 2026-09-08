import { services } from './services';
import { describe, it, expect } from 'vitest'

describe('services', () => {
  it('should work', () => {
    expect(services()).toEqual('services');
  });
});
