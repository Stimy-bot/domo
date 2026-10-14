import { controllers } from './controllers';
import { describe, it, expect } from 'vitest';

describe('controllers', () => {
  it('should work', () => {
    expect(controllers()).toEqual('controllers');
  });
});
