import type { ReactNode } from 'react';
import { UiHeader } from '@domo/ui-header';
import { UiFooter } from '@domo/ui-footer';

interface MainLayoutProps {
  children: ReactNode;
}

function MainLayout({ children }: MainLayoutProps) {
  return (
      <div className="animate-slide-in-left dark:bg-dark-hard bg-white">
    <UiHeader />
        {children}
      <UiFooter />
      </div>
  );
}

export { MainLayout };