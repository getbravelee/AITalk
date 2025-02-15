import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UseFaceVerification = () => {
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(false);
  
  const verifyFace = async (from: string) => {
    const who = from === 't' ? 'user/face-login' : 'child/face-choice'
    try {
      const response = await fetch(
        `http://localhost:5000/${who}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        }
      );
      const data = await response.json();
      console.log(data)

      if (Number(data?.status) === 200) {
        if (from === 't') {
          alert(`안녕하세요 ${data.therapist_name}님!`);
          navigate('/KidFaceLoginPage');  
        }
        else {
          alert(`안녕! ${data.child_name}야!`);
          navigate('/play-select');
        }
        
      } else {
        console.log(data.status);
        console.error('인증 실패');
        alert('인증이 실패했습니다! 다시 시도해주세요!')
      }
    } catch (error) {
      console.error('서버 요청 중 에러 발생:', error);
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    setIsVerifying(true);
    // 첫 페이지 이동 시 곧바로 얼굴인증 요청
    verifyFace(''); // or any appropriate argument
  }, []);

  return { isVerifying, verifyFace };
};
export default UseFaceVerification;
