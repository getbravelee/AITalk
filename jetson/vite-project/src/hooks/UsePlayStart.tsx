import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setTreatmentId } from '../feature/treatment/treatmentSlice';

interface PlayStartParams {
  therapistId: string;
  childId: string;
}

export const usePlayStart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const playStart = useCallback(
    async ({ therapistId, childId }: PlayStartParams): Promise<any> => {
      try {
        const response = await fetch('http://localhost:5000/play-start', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ therapistId, childId }),
        });

        if (!response.ok) {
          throw new Error(`서버 응답 상태 코드: ${response.status}`);
        }

        // responseData는 { treatmentId: xx }의 형태로 응답이 들어옴
        const responseData = await response.json();
        console.log(`${responseData.treatmentId}: treatmentData 번호입니다.`);

        // Redux에 treatmentId 저장
        dispatch(setTreatmentId(responseData.treatmentId));

        // ✅ `childId`와 `therapistId`도 함께 `state`로 전달
        navigate('/play-select', {
          state: {
            treatmentId: responseData.treatmentId,
            childId: childId,
            therapistId: therapistId,
          },
        });

        return responseData;
      } catch (error) {
        console.error('플레이 시작 요청 실패:', error);
        throw error;
      }
    },
    [],
  );

  return playStart;
};
