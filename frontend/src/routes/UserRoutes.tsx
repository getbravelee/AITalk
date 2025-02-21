import { Routes, Route, Navigate } from 'react-router-dom';
import UserLoginPage from '../pages/user/UserLoginPage';
import UserSignUpPage from '../pages/user/UserSignUpPage';
import UserFindIdPage from '../pages/user/UserFindIdPage';
import UserFindPwPage from '../pages/user/UserFindPwPage';
import UserPwReset from '../pages/user/UserPwReset';
// 🎈 정상적으로 css style을 상속받기 위해 부모 import
import User from '../pages/user/User';

export default function UserRoutes() {
  return (
    <Routes>
      {/* 🎈 상속을 위한 태그 감싸기기 */}
      <Route path="/" element={<User />}>
        <Route path="login" element={<UserLoginPage />} />
        <Route path="signup" element={<UserSignUpPage />} />
        <Route path="find-id" element={<UserFindIdPage />} />
        <Route path="find-pw" element={<UserFindPwPage />} />
        <Route path="find-pw-reset" element={<UserPwReset />} />
        {/* 잘못된 경로는 로그인 페이지로 리디렉션 */}
        <Route path="*" element={<Navigate to="/user/login" />} />
      </Route>
    </Routes>
  );
}
