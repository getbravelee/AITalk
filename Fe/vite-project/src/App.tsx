import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/HomePage";
import MenuPage from "./pages/MenuPage";
import NfcTagPage from "./pages/NfcTagPage";
import TherapistFaceLoginPage from "./pages/TherapistFaceLoginPage";
import TherapistLoginPage from "./pages/TherapistLoginPage";
import TherapistFaceResisterPage from "./pages/TherapistFaceResisterPage";
import TherapistFaceResisterCompletePage from "./pages/TherapistFaceResisterCompletePage";
import HomeAfterLoginPage from "./pages/HomeAfterLoginPage";
import KidSelectPage from "./pages/KidSelectPage";
import KidFaceLoginPage from "./pages/KidFaceLoginPage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/TherapistFaceLoginPage" element={<TherapistFaceLoginPage />} />
        <Route path="/TherapistLoginPage" element={<TherapistLoginPage />} />
        <Route path="/TherapistFaceResisterPage" element={<TherapistFaceResisterPage />} />
        <Route path="/TherapistFaceResisterCompletePage" element={<TherapistFaceResisterCompletePage />} />
        <Route path="/HomeAfterLoginPage" element={<HomeAfterLoginPage />} />
        <Route path="/KidSelectPage" element={<KidSelectPage />} />
        <Route path="/KidFaceLoginPage" element={<KidFaceLoginPage />} />
        <Route path="/Nfc" element={<NfcTagPage />} />
        <Route path="/MenuPage" element={<MenuPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
