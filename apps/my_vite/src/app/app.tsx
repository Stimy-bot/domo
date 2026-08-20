import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '../components/MainLayout';
import { HomePage } from '../pages/HomePage';
import { AboutPage } from '../pages/AboutPage';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
      </Route>
    </Routes>
  );
}

export default App;