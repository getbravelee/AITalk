import { useLocation } from 'react-router-dom';
import './ChildDetailPage.css';
import DetailChildContainer from '../../../components/main/child/DetailCardContainer';
import ChildScheduleList from '../../../components/main/child/ChildScheduleList';
import { treatmentDummyData } from '../../../utils/treatmentDummyData';

export default function ChildDetailPage() {
  const { state } = useLocation();
  if (!state) {
    return <p>유효한 아동 정보가 없습니다.</p>;
  }

  const { id, childName, age, disabilityType, center } = state;

  const filteredTreatments = treatmentDummyData.filter((treatment) => treatment.childId === id);

  return (
    <div className="child-detail-container">
      <DetailChildContainer
        childName={childName}
        age={age}
        disabilityType={disabilityType}
        center={center}
      />
      <ChildScheduleList treatments={filteredTreatments} />
    </div>
    
  );
}
