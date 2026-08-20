import { render } from '@testing-library/react';
import UiHeader from './ui-header.js';
import { describe, it, expect } from 'vitest';

describe('UiHeader', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<UiHeader />);
    expect(baseElement).toBeTruthy();
  });
});
