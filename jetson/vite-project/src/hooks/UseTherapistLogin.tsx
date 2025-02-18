import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../feature/user/userSlice';

const UseTherapistLogin = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(false);

  const verifyLogin = async (id:string, password:string) => {
    try {
      const response = await fetch(`http://localhost:5000/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({id, password}),
      });

      const data = await response.json();

      if (Number(response.status) === 200) {
        alert(`안녕하세요 ${data.therapist_name}님!`);
        dispatch(setUser(data));
        navigate('/KidFaceLoginPage');
      } else {
        console.error('인증 실패');
        alert('인증이 실패했습니다! 다시 시도해주세요!');
      }
    } catch (error) {
      console.error('서버 요청 중 에러 발생:', error);
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    setIsVerifying(true);
  }, []);

  return { isVerifying, verifyLogin };
};
export default UseTherapistLogin;
