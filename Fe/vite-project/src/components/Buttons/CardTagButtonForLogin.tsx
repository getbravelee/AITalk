import { useNavigate } from 'react-router-dom';
import { Button } from '@chakra-ui/react';
import '../../pages/HomePage.css';
import { useDispatch } from 'react-redux';
import { setUser } from '../../feature/user/userSlice';
import { useEffect, useRef, useState } from 'react';

export default function CardTagButtonForLogin() {
  const navigate = useNavigate();
  // 전역 상태 관리를 위한 dispatch
  const dispatch = useDispatch();
  // 컴포넌트가 여전히 active한지 여부를 tracking 하는 ref
  const isActive = useRef(true);
  // 진행 중인 fetch 요청의 AbortController를 보관하는 ref
  const fetchControllerRef = useRef<AbortController | null>(null);
  // 컴포넌트 언마운트시 pending fetch를 abort하고, 이후 후속 작업을 막음
  useEffect(() => {
    return () => {
      isActive.current = false;
      if (fetchControllerRef.current) {
        fetchControllerRef.current.abort();
      }
    };
  }, []);
  // 잘못된 카드로 인증을 시도한 경우 실패 카운트 관리를 위한 state
  const [failedAttempts, setFailedAttempts] = useState(0);

  const handleClick = async (): Promise<void> => {
    console.log('📡 Fetching card data from server...');

    navigate('/nfc-tag');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10초 후 요청 자동 취소

    try {
      const response = await fetch('http://192.168.30.146:5000/user/login', {
        method: 'POST', // POST 방식으로 요청
        headers: {
          'Content-Type': 'application/json', // JSON 형식의 요청 헤더
        },
        // 서버에서 요구하는 데이터 형식에 맞게 body 내용을 채워주세요.
        body: JSON.stringify({
          tagInfo: 'example-tag-info', // 예시 데이터, 실제 값으로 변경 필요
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      // 서버가 404를 응답한 경우 alert 후 작업 중단
      if (response.status === 404) {
        setFailedAttempts((prev) => {
          const newCount = prev + 1;
          if (newCount >= 3) {
            alert('3번 초과하여 인증에 실패했습니다. 인증 과정을 종료합니다.');
            navigate('/'); // 메인 페이지로 이동
            return 0; // 카운트 리셋
          } else {
            alert('인증된 사용자가 아닙니다. 다른 카드를 사용해 주세요!');
            return newCount;
          }
        });
        return;
      }

      if (!response.ok)
        throw new Error(
          `Failed to fetch card data (Status: ${response.status})`,
        );
      const cardData = await response.json();
      console.log('✅ Server Response Data:', cardData);

      // 전역 상태에 사용자 데이터 저장 (redux-persist를 통해 유지됨)
      dispatch(setUser(cardData));
      // 성공 시 카운트 초기화
      setFailedAttempts(0); 

      alert(`${cardData.therapist_name}님 안녕하세요!`);
      navigate('/KidFaceLoginPage');
    } catch (error: any) {
      // 이미 페이지가 이동되었다면 후속 alert를 띄우지 않음
      if (!isActive.current) return; 
      // AbortError의 경우 alert를 띄우지 않고 그냥 종료
      if (error.name === 'AbortError') {
        console.error('Fetch aborted:', error);
        return;
      }

      alert('인식된 사용자가 아닙니다. 다른 카드를 시도해주세요!');
      console.error('❌ Error fetching card data:', error);
    }
  };

  return (
    <Button className="CardLoginButton" onClick={() => handleClick()}>
      카드 태깅으로 로그인 하기
    </Button>
  );
}
