import { client } from './client';
import { describe, it, expect } from 'vitest'

describe('client', () => {
  it('should work', () => {
    expect(client()).toEqual('client');
  });
});
