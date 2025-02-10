import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as tf from '@tensorflow/tfjs';
import * as blazeface from '@tensorflow-models/blazeface';
/**
UseFaceRegistration hook
– webcamRef: react‑webcam 컴포넌트의 ref (video 요소 접근)
– canvasRef: 얼굴 검출 결과를 그릴 canvas의 ref
– isVerifying / setIsVerifying: 중복 등록 방지를 위한 상태
– cardData: 등록할 대상의 데이터 (예: therapist_id, therapist_name)
이 hook은 BlazeFace를 이용해 주기적으로 얼굴 검출 후,
얼굴이 검출되면 API에 등록 요청을 보냅니다.
*/
const UseFaceRegistration = (
  webcamRef: React.MutableRefObject<any>,
  canvasRef: React.MutableRefObject<any>,
  isVerifying: boolean,
  setIsVerifying: (verifying: boolean) => void,
  cardData: { therapist_id: number; therapist_name: string },
) => {
  const navigate = useNavigate();
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [model, setModel] = useState<blazeface.BlazeFaceModel | null>(null);
  useEffect(() => {
    // TensorFlow.js 준비 후 BlazeFace 모델 로드
    const loadModel = async () => {
      await tf.ready();
      const loadedModel = await blazeface.load();
      setModel(loadedModel);
    };
    loadModel();
  }, []);
  useEffect(() => {
    // 주기적으로 영상에서 얼굴을 검출합니다.
    const interval = setInterval(async () => {
      if (registrationComplete) return;
      if (webcamRef.current && canvasRef.current && model) {
        const video = webcamRef.current.video;
        if (!video || video.readyState !== 4) return;
        // BlazeFace를 통해 얼굴 검출 (두 번째 인자는 tensor 반환 여부; false로 설정)
        const predictions = await model.estimateFaces(video, false);

        // 캔버스에 검출 결과 시각화
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // 비디오 크기에 맞게 canvas 크기를 재설정 후 기존 결과 지움
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          predictions.forEach((prediction) => {
            if (prediction.topLeft && prediction.bottomRight) {
              const [x, y] = prediction.topLeft as number[];
              const [x2, y2] = prediction.bottomRight as number[];
              const width = x2 - x;
              const height = y2 - y;
              ctx.strokeStyle = 'red';
              ctx.lineWidth = 2;
              ctx.strokeRect(x, y, width, height);
              // (필요시 landmark도 그릴 수 있습니다.)
            }
          });
        }

        // 얼굴이 감지됐고 등록 중이 아니라면 등록 API 호출
        if (!isVerifying && predictions.length > 0 && cardData?.therapist_id) {
          setIsVerifying(true);
          // react‑webcam getScreenshot()를 통해 현재 프레임 캡쳐 가능 (등록용 이미지로 활용 가능)
          const faceSnapshot = webcamRef.current.getScreenshot?.();
          // 얼굴 등록 API 호출 (아래 registerFace 함수 참고)
          await registerFace(
            cardData.therapist_id,
            cardData.therapist_name,
            navigate,
            setIsVerifying,
            () => setRegistrationComplete(true),
          );
        }
      }
    }, 100);
    return () => clearInterval(interval);
  }, [
    isVerifying,
    webcamRef,
    canvasRef,
    model,
    cardData,
    registrationComplete,
    navigate,
    setIsVerifying,
  ]);
  /**
registerFace 함수
서버에 POST 요청을 보내어 얼굴 등록을 시도합니다.
*/
  async function registerFace(
    therapist_id: number,
    therapist_name: string,
    navigate: any,
    setIsVerifying: (verifying: boolean) => void,
    onRegistrationComplete: () => void,
  ) {
    try {
      const response = await fetch(
        'http://192.168.30.189:5000/user/face-regist',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ therapist_id, therapist_name }),
        },
      );
      const data = await response.json();
      if (Number(data?.status) === 201) {
        alert('얼굴 등록이 성공했습니다!');
        onRegistrationComplete();
        navigate('/KidFaceLoginPage');
      } else {
        console.error('얼굴 등록 실패:', data?.message || '');
      }
    } catch (error) {
      console.error('서버 요청 중 에러 발생:', error);
    } finally {
      setIsVerifying(false);
    }
  }
  return { registrationComplete };
};
export default UseFaceRegistration;
