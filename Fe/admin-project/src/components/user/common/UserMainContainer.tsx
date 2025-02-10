import './UserMainContainer.css';
import { ReactNode } from 'react';

interface UserMainContainerProps {
  children: ReactNode; // ✅ children 타입 정의
}

export default function UserMainContainer({
  children,
}: UserMainContainerProps): React.JSX.Element {
  return <div className="user-main-container">{children}</div>;
}
