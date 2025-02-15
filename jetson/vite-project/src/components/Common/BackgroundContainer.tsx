import './BackgroundContainer.css';

export default function BackgroundKidContainer({ 
  children 
}: { 
  children?: React.ReactNode 
}) {
  return (
    <div className='BackgroundKidContainer'>
      {children}
    </div>
  );
}