import { BrowserRouter, Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import CardPlaySelectPage from './pages/CardPlaySelectPage';
import NfcTagPage from './pages/NfcTagPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/card-play-select" element={<CardPlaySelectPage />} />
        <Route path="/nfc-tag" element={<NfcTagPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
