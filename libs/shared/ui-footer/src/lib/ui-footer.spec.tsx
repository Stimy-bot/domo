import { render } from '@testing-library/react';
import UiFooter from './ui-footer';
import { describe, it, expect } from 'vitest';

describe('UiFooter', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<UiFooter />);
    expect(baseElement).toBeTruthy();
  });
});
