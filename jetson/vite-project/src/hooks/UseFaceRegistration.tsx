import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface CardData {
  therapist_id: number;
  therapist_name: string;
}

const UseFaceRegistration = (
  // isVerifying: boolean,
  // setIsVerifying: (verifying: boolean) => void,
  cardData: CardData,
) => {
  const navigate = useNavigate();
  const [registrationComplete, setRegistrationComplete] = useState(false);

  async function registerFace(therapist_id: number, therapist_name: string) {
    try {
      const response = await fetch('http://localhost:5000/user/face-regist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ therapist_id, therapist_name }),
      });
      const data = await response.json();
      if (Number(data?.status) === 201) {
        alert('얼굴 등록이 성공했습니다!');
        setRegistrationComplete(true);
        navigate('/KidFaceLoginPage');
      } else {
        console.error('얼굴 등록 실패:', data?.message || '');
      }
    } catch (error) {
      console.error('서버 요청 중 에러 발생:', error);
    } finally {
      setIsVerifying(false);
    }
  }

  useEffect(() => {
    setIsVerifying(true);
    registerFace(cardData.therapist_id, cardData.therapist_name);
  }, []);

  return { registrationComplete };
};

export default UseFaceRegistration;
