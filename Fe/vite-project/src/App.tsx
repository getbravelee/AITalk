import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PlaySelectPage from './pages/PlaySelectPage';
import NfcTagPage from './pages/NfcTagPage';
import CardPlaySelectPage from './pages/CardPlaySelectPage';
import CardPlaySelectWordPage from './pages/CardPlaySelectWordPage';
import CardPlaySelectWordVerbPage from './pages/CardPlaySelectWordVerbPage';
import CardPlaySelectWordVerbSentencePage from './pages/CardPlaySelectWordVerbSentencePage';
import TherapistFaceLoginPage from './pages/TherapistFaceLoginPage';
import TherapistLoginPage from './pages/TherapistLoginPage';
import TherapistFaceResisterPage from './pages/TherapistFaceResisterPage';
import TherapistFaceResisterCompletePage from './pages/TherapistFaceResisterCompletePage';
import HomeAfterLoginPage from './pages/HomeAfterLoginPage';
import KidSelectPage from './pages/KidSelectPage';
import KidFaceLoginPage from './pages/KidFaceLoginPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/play-select" element={<PlaySelectPage />} />
        <Route path="/nfc-tag" element={<NfcTagPage />} />
        <Route
          path="/card-play-select"
          element={<CardPlaySelectPage />}
        ></Route>
        <Route
          path="/card-play-select/word"
          element={<CardPlaySelectWordPage />}
        ></Route>
        <Route
          path="/card-play-select/word/verb"
          element={<CardPlaySelectWordVerbPage />}
        ></Route>
        <Route
          path="/card-play-select/word/verb/sentence"
          element={<CardPlaySelectWordVerbSentencePage />}
        ></Route>
        <Route
          path="/TherapistFaceLoginPage"
          element={<TherapistFaceLoginPage />}
        />
        <Route path="/TherapistLoginPage" element={<TherapistLoginPage />} />
        <Route
          path="/TherapistFaceResisterPage"
          element={<TherapistFaceResisterPage />}
        />
        <Route
          path="/TherapistFaceResisterCompletePage"
          element={<TherapistFaceResisterCompletePage />}
        />
        <Route path="/HomeAfterLoginPage" element={<HomeAfterLoginPage />} />
        <Route path="/KidSelectPage" element={<KidSelectPage />} />
        <Route path="/KidFaceLoginPage" element={<KidFaceLoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
