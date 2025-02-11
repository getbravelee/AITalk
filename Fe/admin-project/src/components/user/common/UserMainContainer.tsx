import './UserMainContainer.css';
import { ReactNode } from 'react';

interface UserMainContainerProps {
  //  React에서 유효한 모든 형태의 자식 요소(컴포넌트, 문자열, 숫자 등)를 나타내는 타입을 사용
  children: ReactNode; // ✅ children 타입 정의
}

export default function UserMainContainer({
  children,
}: UserMainContainerProps): React.JSX.Element {
  // 내부에 {children}을 포함함으로써, 전달받은 자식 요소들이
  // 해당 스타일의 적용을 받으면서 출력됩니다.
  return <div className="user-main-container">{children}</div>;
}
