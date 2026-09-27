import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { MainLayout } from '@domo/reusableComponents';
import { About } from '../pages/About';
import { Home } from '../pages/Home';
import { NotFound } from '../pages/NotFound';
import { Contact } from '../pages/Contact';
import { Login } from '../pages/Login';


const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <MainLayout>
        <Outlet />
      </MainLayout>
    ),
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'about',
        element: <About />,
      },
      {
        path: 'contact',
        element: <Contact />,
      },
      {
        path: 'login',
        element: <Login />
      }
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default function App() {
  return <RouterProvider router={router} future={{ v7_startTransition: true }} />;
}