import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../feature/user/userSlice';

interface CardData {
  therapist_id: number;
  therapist_name: string;
}

const UseFaceRegistration = (cardData: CardData) => {
  const navigate = useNavigate();
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const dispatch = useDispatch();
  
  async function registerFace(therapist_id: number, therapist_name: string, from: string, child_id: number, child_name: string) {
    const who = from === 't' ? 'user/face-regist' : 'child/face-regist'
    const body = from === 't' ? {therapist_id,therapist_name} : {child_id, child_name}
   
    console.log(body)
    try {
      const response = await fetch(
        `http://localhost:5000/${who}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        },
      );
      const data = await response.json();
      console.log('✅ 서버 응답 데이터:', data);
      if (Number(data?.status) === 201) {
        alert('얼굴 등록이 성공했습니다!');
        setRegistrationComplete(true);
        dispatch(setUser(data));
        navigate('/KidFaceLoginPage');
      } else {
        alert(`${data?.message}`)
        console.error('얼굴 등록 실패:', data?.message || '');
      }
    } catch (error) {
      console.error('서버 요청 중 에러 발생:', error);
    }
  }

  return { registrationComplete, registerFace }; // registerFace를 반환
};


export default UseFaceRegistration;
