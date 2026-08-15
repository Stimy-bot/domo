import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {UiSidebar} from './ui-sidebar';

describe('UiSidebar', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<UiSidebar />);
    expect(baseElement).toBeTruthy();
  });
});
