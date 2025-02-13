import './ChildListPage.css';
import { useNavigate } from 'react-router-dom';
import { careChildrenDummyData } from '../../../utils/careChildrenDummyData';
import CardContainer from '../../../components/main/child/CardContainer';


export default function ChildListPage() {
  const navigate = useNavigate();

  const handleAddChild = () => {
    navigate('/main/child/register'); // ✅ 아동 등록 페이지로 이동
  };




  return (
    <div className="child-list-container">
       <div className="header">
        <h1>치료 아동 관리</h1>
        <button className="add-child-button" onClick={handleAddChild}>
          + 아동 등록
        </button> 
      </div>
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
