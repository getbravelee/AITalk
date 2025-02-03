import { Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import TestPage from './pages/TestPage';
import NfcTagPage from './pages/NfcTagPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/test" element={<TestPage />} />
      <Route path="/nfc" element={<NfcTagPage />} />
    </Routes>
  );
}

export default App;
