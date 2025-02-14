import { useCallback } from "react";

interface PlayStartParams {
  therapistId: string;
  childId: string;
}

export const usePlayStart = () => {
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
      
      const responseData = await response.json();
      console.log(`${responseData}: treatmentData 번호입니다.` )
      return responseData;
      
    } catch (error) {
      console.error("플레이 시작 요청 실패:", error);
      throw error;
    }
  }, []);

  return playStart;
};
