import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Homepage";
import MenuPage from "./pages/MenuPage";
import DetailSelectPage from "./pages/DetailSelectpage";
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
