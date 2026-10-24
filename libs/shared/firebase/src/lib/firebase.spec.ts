import { describe, expect, it } from 'vitest';
import { firebase } from './firebase.js';

describe('firebase', () => {
  it('should work', () => {
    expect(firebase).toBeDefined();
  });
});
