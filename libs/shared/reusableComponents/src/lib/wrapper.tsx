// libs/shared/reusableComponents/src/lib/wrapper.tsx
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export function Wrapper({ children }: Props) {
  return <div className="flex justify-center">{children}</div>;
}
