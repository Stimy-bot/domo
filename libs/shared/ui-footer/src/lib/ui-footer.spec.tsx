import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { UiFooter } from './ui-footer.js';

describe('UiFooter', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<UiFooter />);
    expect(baseElement).toBeTruthy();
  });
});
