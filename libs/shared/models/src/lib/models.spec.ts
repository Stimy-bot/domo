import { describe, expect, it } from 'vitest';
import { models } from './models.js';

describe('models', () => {
  it('should work', () => {
    expect(models()).toEqual('models');
  });
});
