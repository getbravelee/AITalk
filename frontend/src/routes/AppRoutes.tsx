import { Routes, Route, Navigate } from 'react-router-dom';
import MainRoutes from './MainRoutes';
import UserRoutes from './UserRoutes';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/main/*" element={<MainRoutes />} />
      <Route path="/user/*" element={<UserRoutes />} />

      {/* ✅ 기본 경로를 로그인 페이지로 리디렉션 */}
      {/* Navigate : 현재 경로에서 지정한 경로로 즉시 이동하도록 만드는 컴포넌트 */}
      {/* replace : 리디렉션 시 브라우저 히스토리에 새로운 항목을 추가하지 않고 현재 기록을 대체 */}
      {/* 사용자가 브라우저 뒤로 가기 버튼을 눌렀을 때, 무한 리디렉션이나 불필요한 히스토리 항목이 쌓이지 않도록 도와줍니다. */}
      <Route path="/" element={<Navigate to="/user/login" replace />} />

      {/* 잘못된 경로 처리 */}
      <Route path="*" element={<h1>404 - 페이지를 찾을 수 없습니다</h1>} />
    </Routes>
  );
}
