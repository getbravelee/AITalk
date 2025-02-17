import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlayStart } from '../hooks/UsePlayStart';
import { RootState } from '../feature/store';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../feature/user/userSlice';
import { setChildId } from '../feature/child/childSlice';

const UseFaceVerification = () => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const playStart = usePlayStart();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(false);
  const dispatch = useDispatch();

  const verifyFace = async (from: string) => {
    const who = from === 't' ? 'user/face-login' : 'child/face-choice';
    try {
      const response = await fetch(`http://localhost:5000/${who}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      console.log(data);

      if (Number(data?.status) === 200) {
        // 치료사 얼굴 로그인인 경우
        if (from === 't') {
          alert(`안녕하세요 ${data.therapist_name}님!`);
          dispatch(setUser(data));
          navigate('/KidFaceLoginPage');
        }
        // 아이의 얼굴 로그인인 경우
        else {
          alert(`안녕! ${data.child_name}아아!`);
          dispatch(setChildId(data))
          try {
            // 아래 함수 동작으로 play-select 페이지로 이동
            await playStart({
              therapistId: currentUser?.therapist_id,
              childId: data.child_id,
            });
          } catch (error) {
            console.error('플레이 시작 요청 실패:', error);
          }
        }
      } else {
        console.log(data.status);
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

  return { isVerifying, verifyFace };
};
export default UseFaceVerification;
