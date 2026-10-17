import { Outlet, Route, Routes } from 'react-router-dom';
import { MainLayout } from '@domo/reusableComponents';

import { About } from '../pages/About';
import { Home } from '../pages/Home';
import { NotFound } from '../pages/NotFound';
import { Contact } from '../pages/Contact';
import { Comment } from '../pages/Comment';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';

function AppShell() {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="comment" element={<Comment />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}