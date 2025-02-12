import { useDispatch } from 'react-redux';
import { setUser } from '../feature/user/userSlice';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

/* ---------------------------------------------------------------------------
   Custom Hook: useCardTagLogin
   카드 태깅을 통한 로그인 요청 및 실패 횟수 관리,
   그리고 컴포넌트 언마운트 시 진행 중인 요청을 중단하는 로직을 포함합니다.
--------------------------------------------------------------------------- */
export function UseCardTagLogin() {
  const navigate = useNavigate(); // 페이지 이동 기능 제공
  const dispatch = useDispatch(); // 전역 상태 업데이트를 위한 dispatch
  const [failedAttempts, setFailedAttempts] = useState(0); // 인증 실패 시도 횟수 관리

  // 컴포넌트의 활성 상태를 추적하는 ref
  const isActive = useRef(true);
  // 의도된 페이지 이동이 일어났는지 여부를 나타내는 플래그(ref)
  const isNavigating = useRef(false);
  // 진행 중인 fetch 요청의 AbortController를 저장할 ref
  const fetchControllerRef = useRef<AbortController | null>(null);

  // 컴포넌트 언마운트 시 cleanup: 의도적으로 이동한 경우에는 abort하지 않음
  useEffect(() => {
    return () => {
      isActive.current = false;
      if (fetchControllerRef.current && !isNavigating.current) {
        fetchControllerRef.current.abort();
      }
    };
  }, []);

  /* -------------------------------------------------------------------------
     cardLogin 함수
     - 서버에 POST 요청을 보내어 카드 태깅 로그인을 처리합니다.
     - 10초 이후에는 요청을 자동 취소하도록 timeout을 설정합니다.
     - 서버 응답 코드가 404인 경우, 실패 횟수를 증가시키고 
       3회 이상 실패 시 메인 페이지로 이동합니다.
     - 성공 시, Redux 전역 상태에 사용자 데이터를 저장한 후 다음 페이지로 이동합니다.
     - 요청이 취소되거나 에러가 발생하면 적절한 처리를 합니다.
  ------------------------------------------------------------------------- */
  const cardLogin = useCallback(async () => {
    console.log('📡 서버로부터 카드 데이터를 가져옵니다...');

    // 의도적으로 페이지 이동할 경우 플래그 설정
    isNavigating.current = true;

    // 우선 NFC 태깅 진행 화면으로 이동 (로딩이나 진행 상태를 사용자에게 보여줄 수 있음)
    navigate('/nfc-tag');

    // 새 AbortController 생성하여 현재 진행 중인 fetch 요청에 할당
    const controller = new AbortController();
    fetchControllerRef.current = controller;
    // 10초 후 자동으로 요청을 취소하도록 타임아웃 설정
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      // POST 방식으로 카드 태깅 로그인 API 호출
      const response = await fetch('http://localhost:5000/user/card-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // 필요한 경우 실제 카드 데이터로 body 값을 채워 넣으세요.
        // body: JSON.stringify({ tagInfo: 'example-tag-info' }),
        signal: controller.signal,
        credentials: 'include',
      });
      clearTimeout(timeoutId);
      console.log('여기까지 옴?');

      // 404 응답 시, 실패 횟수를 증가시키고 3회 이상이면 메인 페이지로 이동
      if (response.status === 404) {
        setFailedAttempts((prev) => {
          const newCount = prev + 1;
          if (newCount >= 3) {
            alert('3번 초과하여 인증에 실패했습니다. 인증 과정을 종료합니다.');
            navigate('/');
            return 0;
          } else {
            alert('인증된 사용자가 아닙니다. 다른 카드를 사용해 주세요!');
            return newCount;
          }
        });
        return;
      }

      // 기타 에러 발생 시 예외 처리
      if (!response.ok) {
        throw new Error(
          `서버로부터 카드 데이터를 가져오는데 실패했습니다 (Status: ${response.status})`,
        );
      }

      // 서버의 응답 데이터를 JSON 형태로 파싱
      const cardData = await response.json();
      console.log('✅ 서버 응답 데이터:', cardData);

      // 전역 상태(Redux)를 이용해 사용자 데이터 저장
      dispatch(setUser(cardData));
      setFailedAttempts(0);
      alert(`${cardData.therapist_name}님 안녕하세요!`);

      // 로그인 성공 후 최종 페이지로 이동
      navigate('/KidFaceLoginPage');
    } catch (error: any) {
      // 컴포넌트가 언마운트되어도, isActive 대신 의도된 요청 취소만 판단
      if (error.name === 'AbortError') {
        console.error('요청이 중단되었습니다:', error);
        return;
      }
      alert('인식된 사용자가 아닙니다. 다른 카드를 시도해주세요!');
      console.error('❌ 카드 데이터를 가져오는 중 에러 발생:', error);
    }
  }, [dispatch, navigate]);

  return { cardLogin, failedAttempts };
}
