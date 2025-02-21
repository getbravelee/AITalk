import { Outlet } from 'react-router-dom';
import UserMainContainer from '../../components/user/common/UserMainContainer';

export default function User(): React.JSX.Element {
  return (
    <UserMainContainer>
      {/* Outlet은 자식 컴포넌트를 렌더링하는 자리 표시자 역할 */}
      <Outlet /> {/* 자식 컴포넌트가 동적으로 바뀌는 부분 */}
    </UserMainContainer>
  );
}
