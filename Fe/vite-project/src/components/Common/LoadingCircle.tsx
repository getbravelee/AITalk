import './LoadingCircle.css';

interface LoadingCircleProps {
  className?: string; // className을 받을 수 있도록 설정
}

export default function LoadingCircle({ className = '' }: LoadingCircleProps) {
  return (
    <div className={`LoadingContainer ${className}`.trim()}>
      <div className="LoadingCircle"></div>
    </div>
  );
}
