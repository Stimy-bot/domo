import { describe, expect, it } from 'vitest';
import { controllers } from './controllers';

describe('controllers', () => {
  it('should work', () => {
    expect(controllers()).toEqual('controllers');
  });
});
