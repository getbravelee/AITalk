import { Routes, Route } from 'react-router-dom';
import Main from '../pages/main/Main'; 
import HomePage from '../pages/main/HomePage';
import MyPage from '../pages/main/MyPage';
import SchedulePage from '../pages/main/SchedulePage';
import ChildListPage from '../pages/main/child/ChildListPage';
import ChildDetailPage from '../pages/main/child/ChildDetailPage';
import ChildRegisterPage from '../pages/main/child/ChildRegisterPage';

export default function MainRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Main />}> 
        <Route index element={<HomePage />} />
        <Route path="home" element={<HomePage />} />
        <Route path="mypage" element={<MyPage />} />
        <Route path="schedule" element={<SchedulePage />} />
        <Route path="child/list" element={<ChildListPage />} />

        <Route path="child/detail/:id" element={<ChildDetailPage />} />

        <Route path="child/register" element={<ChildRegisterPage />} />


        {/* 잘못된 경로 처리 */}
        <Route path="*" element={<h1>404 - 페이지를 찾을 수 없습니다</h1>} />
      </Route>
    </Routes>
  );
}
