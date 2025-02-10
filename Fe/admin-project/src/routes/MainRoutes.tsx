import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import HomePage from '../pages/main/HomePage';
import MyPage from '../pages/main/MyPage';
import SchedulePage from '../pages/main/SchedulePage';
import ChildDetailPage from '../pages/main/child/ChildDetailPage';
import ChildListPage from '../pages/main/child/ChildListPage';
import ChildRegisterPage from '../pages/main/child/ChildRegisterPage';
import Header from '../components/main/common/Header';

function MainLayout() {
  return (
    <div>
      <Header /> {/* 항상 고정되는 헤더 */}
      <main style={{ padding: '20px' }}>
        <Outlet /> {/* 자식 라우트가 이 위치에 렌더링됨 */}
      </main>
    </div>
  );
}

export default function MainRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="home" element={<HomePage />} />
        <Route path="mypage" element={<MyPage />} />
        <Route path="schedule" element={<SchedulePage />} />
        <Route path="child/detail" element={<ChildDetailPage />} />
        <Route path="child/list" element={<ChildListPage />} />
        <Route path="child/register" element={<ChildRegisterPage />} />

        {/* 잘못된 경로 처리 */}
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Routes>
  );
}
