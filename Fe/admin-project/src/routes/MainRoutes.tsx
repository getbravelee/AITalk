import { Routes, Route } from 'react-router-dom';
import Main from '../pages/main/Main'; // ✅ MainLayout을 가져오기
import HomePage from '../pages/main/HomePage';
import MyPage from '../pages/main/MyPage';
import SchedulePage from '../pages/main/SchedulePage';
import ChildListPage from '../pages/main/child/ChildListPage';

export default function MainRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Main />}>  {/* ✅ Main.tsx 사용 */}
        <Route index element={<HomePage />} />
        <Route path="home" element={<HomePage />} />
        <Route path="mypage" element={<MyPage />} />
        <Route path="schedule" element={<SchedulePage />} />
        <Route path="child/list" element={<ChildListPage />} />

        {/* 잘못된 경로 처리 */}
        <Route path="*" element={<h1>404 - 페이지를 찾을 수 없습니다</h1>} />
      </Route>
    </Routes>
  );
}
