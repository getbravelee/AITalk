// 로그인 전 사용자 관련 라우터
import { Routes, Route } from 'react-router-dom';
import UserMainContainer from '../components/user/common/UserMainContainer';
import UserLoginPage from '../pages/user/UserLoginPage';
import UserSignUpPage from '../pages/user/UserSignUpPage';
import UserFindIdPage from '../pages/user/UserFindIdPage';
import UserFindPwPage from '../pages/user/UserFindPwPage';

export default function UserRoutes() {
  return (
    <UserMainContainer>
      <Routes>
        <Route path="/login" element={<UserLoginPage />} />
        <Route path="/signup" element={<UserSignUpPage />} />
        <Route path="/find-id" element={<UserFindIdPage />} />
        <Route path="/find-pw" element={<UserFindPwPage />} />
        <Route path="*" element={<UserLoginPage />} />{' '}
        {/* 기본 로그인 페이지 */}
      </Routes>
    </UserMainContainer>
  );
}
