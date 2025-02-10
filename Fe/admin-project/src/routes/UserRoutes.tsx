import { Routes, Route, Navigate } from 'react-router-dom';
import UserLoginPage from '../pages/user/UserLoginPage';
import UserSignUpPage from '../pages/user/UserSignUpPage';
import UserFindIdPage from '../pages/user/UserFindIdPage';
import UserFindPwPage from '../pages/user/UserFindPwPage';

export default function UserRoutes() {
  return (
    <Routes>
      <Route path="login" element={<UserLoginPage />} />
      <Route path="signup" element={<UserSignUpPage />} />
      <Route path="find-id" element={<UserFindIdPage />} />
      <Route path="find-pw" element={<UserFindPwPage />} />

      {/* 잘못된 경로는 로그인 페이지로 리디렉션 */}
      <Route path="*" element={<Navigate to="/user/login" />} />
    </Routes>
  );
}
