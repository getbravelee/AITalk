import { Outlet } from 'react-router-dom';

export default function Main() {
  console.log('✅ Main 컴포넌트 렌더링됨');

  return (
    <div style={{ border: '2px solid red', padding: '20px' }}>
      <h1>📍 Main Component</h1>
      <Outlet />
    </div>
  );
}
