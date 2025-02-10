import { BrowserRouter, Routes, Route } from "react-router-dom";

import User from "./pages/user/User";
import Main from "./pages/main/Main";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <MainRoutes />
    </BrowserRouter>
  );
}

function MainRoutes() {
  return (
    <Routes>
      <Route path="/" element={<User />} />
      <Route path="/main" element={<Main />} />
    </Routes>
  );
}
