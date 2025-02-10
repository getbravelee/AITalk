import { useDispatch } from 'react-redux';
import { setUser } from '../feature/user/userSlice';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
/* ---------------------------------------------------------------------------
   Custom Hook: useCardTagLogin
   카드 태깅을 통한 로그인 요청 및 실패 횟수 관리, 그리고 컴포넌트 언마운트 시
   진행 중인 요청을 중단하는 로직을 포함합니다.
--------------------------------------------------------------------------- */
export function UseCardTagLogin() {
  const navigate = useNavigate(); // 페이지 이동 기능 제공
  const dispatch = useDispatch(); // 전역 상태 업데이트를 위한 dispatch
  const [failedAttempts, setFailedAttempts] = useState(0); // 인증 실패 시도 횟수 관리

  // 컴포넌트가 마운트 되어있는지 여부를 추적하는 ref
  const isActive = useRef(true);
  // 진행 중인 fetch 요청의 abort-controller를 저장하는 ref
  const fetchControllerRef = useRef<AbortController | null>(null);

  // 컴포넌트 언마운트 시 실행되는 cleanup effect
  useEffect(() => {
    return () => {
      isActive.current = false; // 컴포넌트가 언마운트 되었음을 표시
      // 진행 중인 fetch가 있다면 abort 시켜서 후속 처리를 중단함
      if (fetchControllerRef.current) {
        fetchControllerRef.current.abort();
      }
    };
  }, []);

  /* -------------------------------------------------------------------------
     cardLogin 함수
     - 서버에 POST 요청을 보내어 카드 태깅 로그인을 처리합니다.
     - 10초 이후에는 요청을 자동으로 취소하도록 timeout을 설정합니다.
     - 서버 응답 코드가 404인 경우, 실패 횟수를 증가시키고 3회 이상 실패 시 메인 페이지로 이동합니다.
     - 성공 시, 받은 사용자 데이터를 redux 전역 상태에 저장하고 다음 페이지로 이동합니다.
     - 요청이 취소되거나 에러가 발생하면 적절한 처리(로그, 알림 등)를 진행합니다.
  ------------------------------------------------------------------------- */
  const cardLogin = useCallback(async () => {
    console.log('📡 서버로부터 카드 데이터를 가져옵니다...');

    // 로그인 진행 중 임시 페이지로 이동 (예: NFC 태깅 진행 화면)
    navigate('/nfc-tag');

    // 새 AbortController 생성하여 현재 진행중인 fetch 요청에 할당
    const controller = new AbortController();
    fetchControllerRef.current = controller;
    // 10초 후 자동으로 요청을 취소하기 위한 타임아웃 설정
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      // POST 방식으로 카드 태깅 로그인 API 호출
      const response = await fetch('http://192.168.30.146:5000/user/card-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // 실제 카드 데이터로 대체해야 하는 예시 데이터
        // body: JSON.stringify({
        //   tagInfo: 'example-tag-info',
        // }),
        signal: controller.signal, // abort-controller의 signal 연결
      });
      // 요청이 정상적으로 완료되었다면 타임아웃 제거
      clearTimeout(timeoutId);

      // 서버가 404 응답을 주면 인증된 사용자가 아님 처리
      if (response.status === 404) {
        setFailedAttempts((prev) => {
          const newCount = prev + 1;
          if (newCount >= 3) {
            alert('3번 초과하여 인증에 실패했습니다. 인증 과정을 종료합니다.');
            navigate('/'); // 3회 실패 시 메인 페이지로 이동
            return 0; // 실패 카운트 초기화
          } else {
            alert('인증된 사용자가 아닙니다. 다른 카드를 사용해 주세요!');
            return newCount;
          }
        });
        return;
      }

      // 응답 상태가 ok가 아니라면 에러 발생 처리
      if (!response.ok) {
        throw new Error(
          `서버로부터 카드 데이터를 가져오는데 실패했습니다 (Status: ${response.status})`,
        );
      }

      // 서버의 응답 데이터를 JSON 형태로 파싱
      const cardData = await response.json();
      console.log('✅ 서버 응답 데이터:', cardData);

      // 전역 상태 (redux)를 이용하여 사용자 데이터를 저장 (추후 persist 등 사용)
      dispatch(setUser(cardData));
      // 로그인 성공 시 실패 횟수 초기화
      setFailedAttempts(0);
      alert(`${cardData.therapist_name}님 안녕하세요!`);
      // 로그인 성공 후 다음 페이지로 이동
      navigate('/KidFaceLoginPage');
    } catch (error: any) {
      // 컴포넌트가 언마운트되었거나 요청이 중단된 경우 후속 처리를 수행하지 않음
      if (!isActive.current) return;
      // AbortError인 경우 특별한 처리 없이 로그만 남김
      if (error.name === 'AbortError') {
        console.error('요청이 중단되었습니다:', error);
        return;
      }
      // 그 외의 에러 발생 시 사용자에게 알림 및 에러 로그 출력
      alert('인식된 사용자가 아닙니다. 다른 카드를 시도해주세요!');
      console.error('❌ 카드 데이터를 가져오는 중 에러 발생:', error);
    }
  }, [dispatch, navigate]);

  // cardLogin 함수와 현재 실패 횟수를 반환
  return { cardLogin, failedAttempts };
}