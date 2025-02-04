import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/HomePage";
import MenuPage from "./pages/MenuPage";
import DetailSelectPage from "./pages/DetailSelectPage";
import CardWordPage from "./pages/CardWordPage";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/MenuPage" element={<MenuPage />} />
        <Route path="/MenuPage/DetailSelectPage" element={<DetailSelectPage />} />
        <Route path="/MenuPage/DetailSelectPage/CardWordPage" element={<CardWordPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
