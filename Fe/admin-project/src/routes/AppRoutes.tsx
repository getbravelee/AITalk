import { BrowserRouter, Routes, Route } from 'react-router-dom';

export default function App() {
  console.log('✅ App 렌더링됨');

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1>🏠 Home Page - 라우터 정상 작동</h1>} />
        <Route path="/test" element={<h1>✅ 테스트 페이지 정상 작동</h1>} />
      </Routes>
    </BrowserRouter>
  );
}
