import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { UiHeader } from './ui-header.js';

describe('UiHeader', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<UiHeader />);
    expect(baseElement).toBeTruthy();
  });
});
