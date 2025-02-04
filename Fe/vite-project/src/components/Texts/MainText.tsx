interface MainTextProps {
  message: string;
}

export default function MainText({ message }: MainTextProps) { 
  return (
    <div className="main-text">
      <h1>{message}</h1>
    </div>
  );
}