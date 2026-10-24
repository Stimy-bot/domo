import { describe, expect, it } from 'vitest';
import { client } from './client.js';

describe('client', () => {
  it('should work', () => {
    expect(client()).toEqual('client');
  });
});
