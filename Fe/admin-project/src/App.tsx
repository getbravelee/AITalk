import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainRoutes from './routes/MainRoutes';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<MainRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}
