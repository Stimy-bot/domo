import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { UiButton } from './ui-button';

describe('UiButton', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<UiButton>Click me</UiButton>);
    expect(baseElement).toBeTruthy();
  });
});
