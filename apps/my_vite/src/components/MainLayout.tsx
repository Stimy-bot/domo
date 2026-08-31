import { Outlet } from 'react-router-dom';
import { UiHeader } from '@domo/ui-header';
import { UiFooter } from '@domo/ui-footer';

const MainLayout = () => {
  return (
    <div className="app-container">
      <UiHeader title="My Vite" />
      <main className="content">
        <Outlet />
      </main>
      <UiFooter />
    </div>
  );
};

export { MainLayout };
