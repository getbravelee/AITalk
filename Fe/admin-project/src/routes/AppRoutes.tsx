import { Routes, Route, Navigate } from 'react-router-dom';
import MainRoutes from './MainRoutes';
import UserRoutes from './UserRoutes';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/main/*" element={<MainRoutes />} />
      <Route path="/user/*" element={<UserRoutes />} />

      {/* ✅ 기본 경로를 로그인 페이지로 리디렉션 */}
      <Route path="/" element={<Navigate to="/user/login" replace />} />

      {/* 잘못된 경로 처리 */}
      <Route path="*" element={<h1>404 - 페이지를 찾을 수 없습니다</h1>} />
    </Routes>
  );
}
