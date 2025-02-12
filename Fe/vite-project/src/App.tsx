import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AudioProvider, useAudio } from './components/Common/AudioContext';

import HomePage from './pages/HomePage';
import PlaySelectPage from './pages/PlaySelectPage';
import NfcTagPage from './pages/NfcTagPage';
import CardPlaySelectPage from './pages/CardPlaySelectPage';
import CardPlaySelectWordPage from './pages/CardPlaySelectWordPage';
import CardPlaySelectWordVerbPage from './pages/CardPlaySelectWordVerbPage';
import CardPlaySelectWordVerbSentencePage from './pages/CardPlaySelectWordVerbSentencePage';
import CardPlaySelectThreeSentencePage from './pages/CardPlaySelectThreeSentencePage';

import CameraScanPage from './pages/CameraScanPage';
import CameraImageGeneratePage from './pages/CameraImageGeneratePage';
import CameraPlaySelectPage from './pages/CameraPlaySelectPage';
import CameraPlaySelectWordPage from './pages/CameraPlaySelectWordPage';
import CameraPlaySelectWordVerbPage from './pages/CameraPlaySelectWordVerbPage';
import CameraPlaySelectWordVerbSentencePage from './pages/CameraPlaySelectWordVerbSentencePage';
import CameraPlaySelectThreeSentencePage from './pages/CameraPlaySelectThreeSentencePage';

import AiTalkPage from './pages/AiTalkPage';

import TherapistFaceLoginPage from './pages/TherapistFaceLoginPage';
import TherapistLoginPage from './pages/TherapistLoginPage';
import TherapistFaceResisterPage from './pages/TherapistFaceRegisterPage';
import TherapistFaceResisterCompletePage from './pages/TherapistFaceRegisterCompletePage';
import HomeAfterLoginPage from './pages/HomeAfterLoginPage';
import KidSelectPage from './pages/KidSelectPage';
import KidFaceLoginPage from './pages/KidFaceLoginPage';

export default function App() {
  return (
    <AudioProvider>
      <BrowserRouter>
        <MainRoutes />
      </BrowserRouter>
    </AudioProvider>
  );
}

function MainRoutes() {
  const { setAudioType } = useAudio();
  const location = useLocation();

  // 🔥 페이지 이동 시 음악 변경
  useEffect(() => {
    if (location.pathname === '/') {
      setAudioType('home'); // ✅ HomePage에서는 homepagemusic.mp3
    } else {
      setAudioType('page'); // ✅ 다른 페이지에서는 pagemusic.mp3 (처음부터 다시 시작되지 않음)
    }
  }, [location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/play-select" element={<PlaySelectPage />} />
      <Route path="/nfc-tag" element={<NfcTagPage />} />
      <Route path="/card-play-select" element={<CardPlaySelectPage />} />
      <Route
        path="/card-play-select/word"
        element={<CardPlaySelectWordPage />}
      />
      <Route
        path="/card-play-select/word/verb"
        element={<CardPlaySelectWordVerbPage />}
      />
      <Route
        path="/card-play-select/word/verb/sentence"
        element={<CardPlaySelectWordVerbSentencePage />}
      />
      <Route
        path="/card-play-select/three-sentence"
        element={<CardPlaySelectThreeSentencePage />}
      />
      <Route path="/camera-scan" element={<CameraScanPage />}></Route>
      <Route
        path="/camera-img-generate"
        element={<CameraImageGeneratePage />}
      ></Route>
      <Route
        path="/camera-play-select"
        element={<CameraPlaySelectPage />}
      ></Route>
      <Route
        path="/camera-play-select/word"
        element={<CameraPlaySelectWordPage />}
      ></Route>
      <Route
        path="/camera-play-select/word/verb"
        element={<CameraPlaySelectWordVerbPage />}
      ></Route>
      <Route
        path="/camera-play-select/word/verb/sentence"
        element={<CameraPlaySelectWordVerbSentencePage />}
      ></Route>
      <Route
        path="/camera-play-select/three-sentence"
        element={<CameraPlaySelectThreeSentencePage />}
      ></Route>
      <Route path="/ai-talk" element={<AiTalkPage />} />
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
  );
}
