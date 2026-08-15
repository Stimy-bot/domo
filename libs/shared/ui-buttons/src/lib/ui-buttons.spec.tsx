import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import {UiButton} from './ui-button';

describe('UiButton', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<UiButton />);
    expect(baseElement).toBeTruthy();
  });
});
