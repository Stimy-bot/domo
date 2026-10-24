import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Sidebar } from './ui-sidebar.js';

describe('Sidebar', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Sidebar />);
    expect(baseElement).toBeTruthy();
  });
});
