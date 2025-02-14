import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setTreatmentId } from "../feature/treatment/treatmentSlice";

interface PlayStartParams {
  therapistId: string;
  childId: string;
}

export const usePlayStart = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const playStart = useCallback(async ({ therapistId, childId }: PlayStartParams): Promise<any> => {
    try {
      const response = await fetch("http://localhost:5000/play-start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ therapistId: therapistId, childId: childId }),
      });

      if (!response.ok) {
        throw new Error(`서버 응답 상태 코드: ${response.status}`);
      }
      // responseData는 {treatmentId: xx}의 형태로 응답이 들어옵니다. 
      const responseData = await response.json();
      console.log(`${responseData.treatmentId}: treatmentData 번호입니다.`)
      // redux-persist에 treatmentId 저장됩니다. 이후 이 값에 접근할 때는
      // import type { RootState } from "../feature/store";
      // import { useSelector } from "react-redux";
      // const treatmentId = useSelector(
      //   (state: RootState) => state.treatment.treatmentId
      // );
      // 이런식으로 접근하여 변수에 담아 사용하면 됩니다. 
      dispatch(setTreatmentId(responseData.treatmentId));
      navigate('/play-select',{ state: { treatmentId: responseData.treatmentId }})
      return responseData;
      
    } catch (error) {
      console.error("플레이 시작 요청 실패:", error);
      throw error;
    }
  }, []);

  return playStart;
};
