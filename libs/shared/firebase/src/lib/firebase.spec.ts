import { firebase } from './firebase.js';
import { describe, it, expect } from 'vitest';  

describe('firebase', () => {
  it('should work', () => {
    expect(firebase()).toEqual('firebase');
  });
});
