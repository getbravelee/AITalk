import './CardContainer.css';
import profile from '../../../assets/images/main/profile_img.png';

interface CardContainerProps {
  childName: string;
  age: number;
  disabilityType: string;
  center: number; 
}

export default function CardContainer({ childName, age, disabilityType, center }: CardContainerProps) {
  return (
    <div className="card-container">
      <img src={profile} alt='profile image' />
      <div className="card-text-container">
        <h2>{childName}</h2>
        <span>{age}세 ({age * 12}개월)</span>
        <hr />
        <p>진료 사항: {disabilityType}</p>
        <p>센터: {center}</p>
      </div>
    </div>
  );
}
