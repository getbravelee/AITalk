import './NavbarContainer.css';

interface NavbarContainerProps {
  children?: React.ReactNode;
}

export default function NavbarContainer({ children }: NavbarContainerProps) {
  return (
    <div className="NavbarContainer">
      {children} {/* children을 추가하여 원하는 요소를 삽입 가능하게 만듦 */}
    </div>
  );
}
