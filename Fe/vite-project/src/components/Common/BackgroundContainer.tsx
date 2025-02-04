import './BackgroundContainer.css';

interface BackgroundContainerProps {
  children?: React.ReactNode;
}
export default function BackgroundContainer({
  children,
}: BackgroundContainerProps) {
  return (
    <div className="BackgroundContainer">
      {children} {/* children을 추가하여 원하는 요소를 삽입 가능하게 만듦 */}
    </div>
  );
}
