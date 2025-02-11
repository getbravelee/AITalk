
import './DetailCardContainer.css';
import profile from '../../../assets/images/main/profile_img.png';

interface DetailChildContainerProps {
  childName: string;
  age: number;
  disabilityType: string;
  center: number;
}

export default function DetailChildContainer({
  childName,
  age,
  disabilityType,
  center,
}: DetailChildContainerProps) {
  return (
    <div className="detail-child-container">
      <img src={profile} alt="profile" className="profile-img" />
      <div className="child-info">
        <h2>{childName} <span>{age}세 ({age * 12}개월)</span></h2>
        <hr />
        <p>진료 사항: {disabilityType}</p>
        <p>센터: {center}</p>
      </div>
    </div>
  );
}
