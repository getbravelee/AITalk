import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as tf from '@tensorflow/tfjs';
import * as blazeface from '@tensorflow-models/blazeface';
import { BlazeFacePrediction } from '@tensorflow-models/blazeface';

/**
UseFaceRegistration hook
– webcamRef: react‑webcam 컴포넌트의 ref (video 요소 접근)
– canvasRef: 얼굴 검출 결과를 그릴 canvas의 ref
– isVerifying / setIsVerifying: 중복 등록 방지를 위한 상태
– cardData: 등록할 대상의 데이터 (예: therapist_id, therapist_name)
이 hook은 BlazeFace를 이용해 주기적으로 얼굴 검출 후,
얼굴이 검출되면 API에 등록 요청을 보냅니다.
*/

// 도우미 함수: 라운드 처리된 사각형 그리기
function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.stroke();
}

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

  // detectionDataRef: face detection 결과를 저장해 두고, drawOverlay에서 사용합니다.
  const detectionDataRef = useRef<{
    videoRect: DOMRect;
    scaleX: number;
    predictions: BlazeFacePrediction[];
    // predictions: blazeface.Face[];
  } | null>(null);

  // 첫 로드 시 BlazeFace 모델 로드
  useEffect(() => {
    const loadModel = async () => {
      await tf.ready();
      const loadedModel = await blazeface.load();
      setModel(loadedModel);
    };
    loadModel();
  }, []);

  // 얼굴 검출 업데이트 (500ms 주기)
  useEffect(() => {
    const detectionInterval = setInterval(async () => {
      if (registrationComplete) return;
      if (webcamRef.current && canvasRef.current && model) {
        const video = webcamRef.current.video;
        if (!video || video.readyState !== 4) return;

        const videoRect = video.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        const canvas = canvasRef.current;
        // 캔버스 크기를 디스플레이에 맞게 갱신
        canvas.width = videoRect.width * dpr;
        canvas.height = videoRect.height * dpr;
        canvas.style.width = `${videoRect.width}px`;
        canvas.style.height = `${videoRect.height}px`;

        // intrinsic 크기와 표시 크기의 비율 계산
        const scaleX = videoRect.width / video.videoWidth;
        const scaleY = videoRect.height / video.videoHeight;

        // BlazeFace로 얼굴 검출
        const predictions = await model.estimateFaces(video, false);
        // detection 관련 데이터를 업데이트
        detectionDataRef.current = { videoRect, scaleX, scaleY, predictions };

        // 얼굴이 감지되었고, 등록 중이 아니며 cardData에 therapist_id가 있다면 등록 API 호출
        if (!isVerifying && predictions.length > 0 && cardData?.therapist_id) {
          setIsVerifying(true);
          // 필요 시 react‑webcam의 getScreenshot()을 통해 snapshot 획득
          const faceSnapshot = webcamRef.current.getScreenshot?.();
          await registerFace(
            cardData.therapist_id,
            cardData.therapist_name,
            navigate,
            setIsVerifying,
            () => setRegistrationComplete(true),
          );
        }
      }
    }, 500);
    return () => clearInterval(detectionInterval);
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

  // requestAnimationFrame을 이용해 부드럽게 오버레이 그리기 (깜빡임 방지)
  useEffect(() => {
    const drawOverlay = () => {
      if (!canvasRef.current || !detectionDataRef.current) {
        requestAnimationFrame(drawOverlay);
        return;
      }
      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) {
        requestAnimationFrame(drawOverlay);
        return;
      }
      const { videoRect, scaleX, scaleY, predictions } = detectionDataRef.current;
      const dpr = window.devicePixelRatio || 1;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, videoRect.width, videoRect.height);

      const isMirrored = true;
      predictions.forEach((prediction) => {
        if (prediction.topLeft && prediction.bottomRight) {
          const [x, y] = prediction.topLeft as [number, number];
          const [x2, y2] = prediction.bottomRight as [number, number];
          const boxWidth = (x2 - x) * scaleX;
          const boxHeight = (y2 - y) * scaleY;
          const adjustedX = isMirrored
            ? videoRect.width - x * scaleX - boxWidth
            : x * scaleX;
          const adjustedY = y * scaleY;

          // 그라데이션 컬러 생성 (세련된 효과)
          const gradient = ctx.createLinearGradient(
            adjustedX,
            adjustedY,
            adjustedX + boxWidth,
            adjustedY + boxHeight,
          );
          gradient.addColorStop(0, 'rgba(30,144,255,0.9)');
          gradient.addColorStop(1, 'rgba(0,191,255,0.3)');

          ctx.strokeStyle = gradient;
          ctx.lineWidth = 4;
          ctx.setLineDash([12, 6]);
          ctx.shadowColor = 'rgba(0,0,0,0.2)';
          ctx.shadowBlur = 6;
          ctx.shadowOffsetX = 2;
          ctx.shadowOffsetY = 2;

          // 라운드 처리된 사각형 그리기
          drawRoundedRect(ctx, adjustedX, adjustedY, boxWidth, boxHeight, 10);

          // 텍스트 라벨 추가
          ctx.font = '16px sans-serif';
          ctx.fillStyle = gradient;
          ctx.fillText('Face Detected!', adjustedX, adjustedY - 10);

          ctx.setLineDash([]);
          ctx.shadowColor = 'transparent';

          // 얼굴 landmark 시각화
          if (prediction.landmarks) {
            const landmarksArray: number[][] = Array.isArray(prediction.landmarks)
              ? (prediction.landmarks as number[][])
              : (prediction.landmarks as tf.Tensor).arraySync() as number[][];
            landmarksArray.forEach((landmark) => {
              const [lx, ly] = landmark;
              const adjustedLX = isMirrored
                ? videoRect.width - lx * scaleX
                : lx * scaleX;
              const adjustedLY = ly * scaleY;
              ctx.beginPath();
              ctx.arc(adjustedLX, adjustedLY, 3, 0, Math.PI * 2);
              ctx.fillStyle = 'rgba(64, 255, 0, 0.82)';
              ctx.fill();
              ctx.closePath();
            });
          }
        }
      });
      requestAnimationFrame(drawOverlay);
    };
    requestAnimationFrame(drawOverlay);
  }, [canvasRef]);

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
