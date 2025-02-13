import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as tf from '@tensorflow/tfjs';
import * as blazeface from '@tensorflow-models/blazeface';

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

const UseFaceVerification = (
  webcamRef: React.MutableRefObject<any>,
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>
) => {
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(false);
  const [model, setModel] = useState<blazeface.BlazeFaceModel | null>(null);
  // detectionData를 업데이트하여 오버레이 그리기에서 사용
  const detectionDataRef = useRef<{
    videoRect: DOMRect;
    scaleX: number;
    scaleY: number;
    predictions: blazeface.NormalizedFace[];
  } | null>(null);

  useEffect(() => {
    const loadModel = async () => {
      await tf.ready();
      const loadedModel = await blazeface.load();
      setModel(loadedModel);
    };
    loadModel();

    // 얼굴 검출 업데이트는 주기적으로(예: 500ms) 실행
    const detectionInterval = setInterval(async () => {
      if (!model || !webcamRef.current || !canvasRef.current) return;

      const video = webcamRef.current.video;
      if (!video || video.readyState !== 4) return;

      // 비디오의 실제 표시 크기 및 devicePixelRatio 가져오기
      const videoRect = video.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const canvas = canvasRef.current;
      // 캔버스 내부 해상도와 스타일 크기 동기화
      canvas.width = videoRect.width * dpr;
      canvas.height = videoRect.height * dpr;
      canvas.style.width = `${videoRect.width}px`;
      canvas.style.height = `${videoRect.height}px`;

      // 비디오 intrinsic 해상도와 실제 표시 크기의 배율 계산
      const scaleX = videoRect.width / video.videoWidth;
      const scaleY = videoRect.height / video.videoHeight;

      // 모델로 얼굴 검출
      const predictions = await model.estimateFaces(video, false);
      // detectionDataRef에 업데이트 (새로운 값으로 오버레이 그리기에 반영)
      detectionDataRef.current = { videoRect, scaleX, scaleY, predictions };

      // 얼굴이 검출되고 인증 중이 아니면 인증 함수 호출
      if (!isVerifying && predictions.length > 0) {
        setIsVerifying(true);
        const faceSnapshot = webcamRef.current.getScreenshot();
        if (faceSnapshot) {
          await verifyFace();
        } else {
          setIsVerifying(false);
        }
      }
    }, 100);

    // 오버레이 그리기: requestAnimationFrame 사용
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
      // devicePixelRatio 반영하고 캔버스 클리어
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
            adjustedY + boxHeight
          );
          gradient.addColorStop(0, 'rgba(30,144,255,0.9)');
          gradient.addColorStop(1, 'rgba(0,191,255,0.3)');

          ctx.strokeStyle = gradient;
          ctx.lineWidth = 4;
          ctx.setLineDash([12, 6]);
          ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
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

    return () => clearInterval(detectionInterval);
  }, [isVerifying, webcamRef, canvasRef, model, navigate]);

  /**
   * verifyFace 함수: 얼굴 검출되면 서버에 POST 요청 후 페이지 이동 진행
   */
  const verifyFace = async () => {
    try {
      const response = await fetch(
        'http://192.168.30.189:5000/user/face-login',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        }
      );
      const data = await response.json();
      if (Number(data?.status) === 200) {
        alert(`안녕하세요 ${data.therapist_name}님!`);
        navigate('/KidFaceLoginPage');
      } else {
        console.error('인증 실패');
      }
    } catch (error) {
      console.error('서버 요청 중 에러 발생:', error);
    } finally {
      setIsVerifying(false);
    }
  };

  return { isVerifying };
};
export default UseFaceVerification;
