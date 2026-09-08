import {error} from './error.js';
import { describe, it, expect } from 'vitest';

describe('shared', () => {
  it('should work', () => {
    expect(error()).toEqual('error');
  });
});
