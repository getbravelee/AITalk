import Header from '../../components/main/common/Header';
import { Outlet } from 'react-router-dom';

export default function Main() {
  return (
    <div>
      <Header /> {/* 항상 고정되는 Header */}
      <main>
        <Outlet /> {/* 자식 라우트가 여기에 렌더링됨 */}
      </main>
    </div>
  );
}
