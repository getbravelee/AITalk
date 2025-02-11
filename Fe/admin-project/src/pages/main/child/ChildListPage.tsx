import './ChildListPage.css';
import { careChildrenDummyData } from '../../../utils/careChildrenDummyData';
import CardContainer from '../../../components/main/child/CardContainer';

export default function ChildListPage() {
  return (
    <div className="child-list-container">
      <h1>치료 아동 관리</h1>
      <div className="card-grid">
        {careChildrenDummyData.map((child) => (
          <CardContainer
            key={child.id}
            id={child.id}
            childName={child.childName}
            age={child.age}
            disabilityType={child.disabilityType}
            center={child.centerId} 
          />
        ))}
      </div>
    </div>
  );
}
