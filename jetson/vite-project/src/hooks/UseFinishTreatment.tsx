// src/hooks/useFinishTreatment.ts
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../feature/store';
import { clearChild } from '../feature/child/childSlice';
import { useNavigate } from 'react-router-dom';

/**
 * useFinishTreatment hook
 * 
 * 이 hook은 현재 선택된 아동 정보를 기반으로 치료 완료 정보를 서버에 전송하고,
 * 성공 시 Redux 상태를 초기화 및 페이지 이동을 수행합니다.
 */
const UseFinishTreatment = () => {
  // redux store로부터 현재 선택된 아동의 id를 가져옵니다.
  const currentChildId = useSelector((state: RootState) => state.child.currentChildId);
  // redux dispatch 함수를 가져옵니다.
  const dispatch = useDispatch();
  // 페이지 이동을 위한 useNavigate hook을 사용합니다.
  const navigate = useNavigate();
  // API 호출 진행 중 여부를 관리하기 위한 상태
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * finishTreatment 함수
   * - 현재 선택된 아동 정보가 없으면 경고창을 띄우고 중단합니다.
   * - 있으면 POST 요청을 통해 서버에 데이터를 전송합니다.
   * - 요청 성공 시 redux 상태(clearChild 액션)를 초기화하고 treatment-complete 페이지로 이동합니다.
   * - 실패 시 에러 메시지를 출력하며, 최종적으로 isSubmitting 상태를 false로 변경합니다.
   */
  const finishTreatment = async () => {
    if (!currentChildId) {
      alert("선택된 아이의 정보가 없습니다.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 서버로 POST 요청 전송 (API 주소는 추후 수정)
      const response = await fetch('http://192.168.30.146:5000/child/dummy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ child_id: currentChildId }),
      });

      // 응답이 정상적이지 않으면 에러 계층으로 분기
      if (!response.ok) {
        throw new Error(`서버 응답 에러 (Status: ${response.status})`);
      }

      // 요청 성공 시 확인 알림 메시지를 띄웁니다.
      alert("치료 완료 정보가 서버에 전송되었습니다.");
      // Redux store에서 아동 정보를 제거하여 상태를 초기화합니다.
      dispatch(clearChild());
      // 치료 완료 후 /treatment-complete 페이지로 이동합니다.
      navigate('/treatment-complete');
    } catch (error) {
      console.error('치료 완료 전송 실패:', error);
      alert("치료 완료 전송에 실패했습니다. 다시 시도해주세요.");
    } finally {
      // 요청 진행 상태를 종료합니다.
      setIsSubmitting(false);
    }
  };

  // 해당 hook은 finishTreatment 함수와 진행 상태를 반환합니다.
  return { finishTreatment, isSubmitting };
};

export default UseFinishTreatment;
