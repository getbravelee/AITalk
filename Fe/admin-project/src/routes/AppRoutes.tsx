import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import UserRoutes from './UserRoutes';
import MainRoutes from './MainRoutes';

export default function AppRoutes(): React.JSX.Element {
  const isLoggedIn = !!localStorage.getItem('authToken'); // ✅ 불리언으로 변환

  return (
    <BrowserRouter>
      <Routes>
        {/* 로그인 여부에 따라 리디렉션 처리 */}
        <Route
          path="/*"
          element={isLoggedIn ? <MainRoutes /> : <UserRoutes />}
        />

        {/* 잘못된 경로로 접근 시 리디렉션 */}
        <Route
          path="*"
          element={<Navigate to={isLoggedIn ? '/home' : '/login'} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}
