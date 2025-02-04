import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CardPlaySelectPage from './pages/CardPlaySelectPage';
import NfcTagPage from './pages/NfcTagPage';
import HomePage from './pages/HomePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/nfc-tag" element={<NfcTagPage />} />
        <Route path="/card-play-select" element={<CardPlaySelectPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
