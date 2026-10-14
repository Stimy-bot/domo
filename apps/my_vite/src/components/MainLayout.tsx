import { Outlet } from 'react-router-dom';
import { UiHeader } from '@domo/ui-header';
import { UiFooter } from '@domo/ui-footer';
import { UiSidebar } from '@domo/ui-sidebar';

export function MainLayout() {
  return (
      <div className="animate-slide-in-left dark:bg-dark-hard bg-white">
      <UiHeader />
      <div className="flex flex-1">
        <UiSidebar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
      <UiFooter />
    </div>
  );
}