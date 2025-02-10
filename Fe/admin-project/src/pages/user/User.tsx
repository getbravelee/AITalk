import { Outlet } from 'react-router-dom';
import UserMainContainer from '../../components/user/common/UserMainContainer';

export default function User(): React.JSX.Element {
  return (
    <UserMainContainer>
      <Outlet /> {/* 자식 컴포넌트가 동적으로 바뀌는 부분 */}
    </UserMainContainer>
  );
}
