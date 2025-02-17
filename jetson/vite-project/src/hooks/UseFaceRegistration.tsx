import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setChildId } from '../feature/child/childSlice';
import { usePlayStart } from '../hooks/UsePlayStart';
import { RootState } from '../feature/store';
import { useSelector } from 'react-redux';

const UseFaceRegistration = () => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const playStart = usePlayStart();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isRegisting, setIsRegisted] = useState(false);
  const [isCompleted, setIsComplted] = useState(false);

  async function registerFace(
    therapist_id: number,
    therapist_name: string,
    from: string,
    child_id: number,
    child_name: string,
  ) {
    // 1. 얼굴 등록 요청과 동시에 setIsRegisted를 true로 변경 ->  animation_1
    setIsRegisted(true);
    const who = from === 't' ? 'user/face-regist' : 'child/face-regist';
    const body =
      from === 't'
        ? { therapist_id, therapist_name }
        : { child_id, child_name };

    console.log(body);
    try {
      const response = await fetch(`http://localhost:5000/${who}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      console.log(`✅ 요청 주소 ${who}`);

      const data = await response.json();

      console.log('✅ 서버 응답 데이터:', data);
      if (Number(data?.status) === 201) {
        setIsComplted(true);
        if (from === 't') {
          // 2. 아이 얼굴 로그인을 위해 페이지 이동
          setTimeout(() => {
            navigate('/KidFaceLoginPage');
          }, 2360);
        } else {
          console.log(data)
          // 1. redux에 현재 치료 대상 아이 정보 저장
          dispatch(setChildId(data.data));
          setTimeout(async () => {
            try {
              // 아래 함수 동작으로 play-select 페이지로 이동
              await playStart({
                therapistId: currentUser?.therapist_id,
                childId: data.data.child_id,
              });
            } catch (error) {
              console.error('플레이 시작 요청 실패:', error);
            }
          }, 2360);
        }
      } else {
        alert(`${data?.message}`);
        console.error('얼굴 등록 실패:', data?.message || '');
      }
    } catch (error) {
      console.error('서버 요청 중 에러 발생:', error);
    } finally {
      // 2. 요청에 대한 응답을 받으면 setIsRegisted false로 변환하여
      // animation_2 보여주기
      setIsRegisted(false);
    }
  }

  return { isRegisting, isCompleted, registerFace }; // registerFace를 반환
};

export default UseFaceRegistration;
