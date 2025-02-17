import './CardContainer.css';
import profile from '../../../assets/images/main/profile_img.png';
import { useNavigate } from 'react-router-dom';

interface CardContainerProps {
  id : number;
  childName: string;
  age: number;
  disabilityType: string;
  center: string
}

export default function CardContainer({ id, childName, age, disabilityType, center }: CardContainerProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/main/child/detail/${id}`, {
      state: { id, childName, age, disabilityType, center }, // 아동 정보 전달
    });
  }
  
  return (
    <div className="card-container" onClick={handleClick}>
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
