import './BackgroundKidContainer.css';

interface BackgroundKidContainerProps {
  children?: React.ReactNode;
}
export default function BackgroundKidContainer({
  children,
}: BackgroundKidContainerProps) {
  return (
    <div className="BackgroundKidContainer">
      {children} {/* children을 추가하여 원하는 요소를 삽입 가능하게 만듦 */}
    </div>
  );
}
