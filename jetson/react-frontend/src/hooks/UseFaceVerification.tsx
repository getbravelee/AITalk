import { useState, useEffect, useRef } from 'react';
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
  const [isVerified, setIsVerified] = useState(false);
  const dispatch = useDispatch();
  // AbortController를 저장할 ref 생성 (컴포넌트 언마운트 시 요청 취소를 위해)
  const abortControllerRef = useRef<AbortController | null>(null);
  const verifyFace = async (from: string) => {
    // 1. 얼굴 인식 요청과 동시에 setIsVerifying을 true로 변경 ->  animation_1
    setIsVerifying(true);

    const who = from === 't' ? 'user/face-login' : 'child/face-choice';

    // AbortController 생성 및 ref에 저장
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch(`http://localhost:5000/${who}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal, // 요청 취소를 위한 signal 전달
      });
      const data = await response.json();
      console.log(data);

      if (Number(data?.status) === 200) {
        setIsVerified(true);
        // 치료사 얼굴 로그인인 경우
        if (from === 't') {
          dispatch(setUser(data));
          // FaceID check animation을 위한 시간지연
          setTimeout(() => {
            navigate('/KidFaceLoginPage');
          }, 2360);
        }
        // 아이의 얼굴 로그인인 경우
        else {
          dispatch(setChildId(data));
          setTimeout(async () => {
            try {
              // 아래 함수 동작으로 play-select 페이지로 이동
              await playStart({
                therapist_id: currentUser?.therapist_id,
                child_id: data.child_id,
              });
            } catch (error) {
              console.error('플레이 시작 요청 실패:', error);
            }
          }, 2360);
        }
      } else {
        console.log(data.status);
        console.error('인증 실패');
        alert('인증이 실패했습니다! 다시 시도해주세요!');
      }
    } catch (error) {
      console.error('서버 요청 중 에러 발생:', error);
    } finally {
      // 2. 요청에 대한 응답을 받으면 setIsVerifying을 false로 변환하여
      // animation_2 보여주기기
      setIsVerifying(false);
    }
  };
  // 컴포넌트 언마운트 시 진행 중인 요청이 있다면 abort 처리
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, []);
  return { isVerifying, isVerified, verifyFace };
};
export default UseFaceVerification;
