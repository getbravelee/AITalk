import { Routes, Route } from 'react-router-dom';
import Main from '../pages/main/Main';
import Header from '../components/main/common/Header';
import HomePage from '../pages/main/HomePage';
import MyPage from '../pages/main/MyPage';
import SchedulePage from '../pages/main/SchedulePage';
import ChildDetailPage from '../pages/main/child/ChildDetailPage';
import ChildListPage from '../pages/main/child/ChildListPage';
import ChildRegisterPage from '../pages/main/child/ChildRegisterPage';

export default function MainRoutes() {
  return (
    <Main>
      <Header />
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/child/detail" element={<ChildDetailPage />} />
        <Route path="/child/list" element={<ChildListPage />} />
        <Route path="/child/register" element={<ChildRegisterPage />} />
        <Route path="*" element={<HomePage />} /> {/* 기본 홈 페이지 */}
      </Routes>
    </Main>
  );
}
