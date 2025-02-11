import { useNavigate } from 'react-router-dom'
import './HomePage.css'
import careChildButton from '../../assets/images/main/care_child_button.png'
import scheduleButton from '../../assets/images/main/schedule_button.png'



export default function HomePage() {
  const navigate = useNavigate();


  const handleCareChild = () => {
    navigate('/main/child/list');
  }
  
  const handleSchedule = () => {
    navigate('/main/schedule');
  }


  return (
    <div className='container'>
      <div className = 'care-child'>
        <img src={careChildButton} alt="Care Child Button" onClick={handleCareChild}/>
        <h1>치료 아동 관리</h1>
      </div>
      <div className='schedule'>
        <img src={scheduleButton} alt="Schedule Button" onClick={handleSchedule}/>
        <h1>치료 예약 관리</h1>
      </div>
    </div>
  );
}
