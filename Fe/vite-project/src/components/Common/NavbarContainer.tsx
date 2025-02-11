<<<<<<< HEAD
import './NavbarContainer.css';
=======
import '../../styles/NavbarContainer.css';
import BackButton from './BackButton';
>>>>>>> develop

interface NavbarContainerProps {
  children?: React.ReactNode;
}

<<<<<<< HEAD
export default function NavbarContainer({ children }: NavbarContainerProps) {
  return (
    <div className="NavbarContainer">
=======
function NavbarContainer({ children }: NavbarContainerProps) {
  return (
    <div className="NavbarContainer">
      <BackButton />
>>>>>>> develop
      {children} {/* children을 추가하여 원하는 요소를 삽입 가능하게 만듦 */}
    </div>
  );
}
