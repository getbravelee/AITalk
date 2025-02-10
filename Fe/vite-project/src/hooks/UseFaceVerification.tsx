import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as tf from '@tensorflow/tfjs';
import * as blazeface from '@tensorflow-models/blazeface';
/**
UseFaceVerification hook (BlazeFace 버전)
이 hook은 BlazeFace 모델을 로드하여 웹캠 비디오에서 얼굴을 실시간으로 검출합니다.
검출 결과는 캔버스에 시각화되고, 얼굴이 감지되면 verifyFace 함수를 호출합니다.
*/
const UseFaceVerification = (
  webcamRef: React.MutableRefObject<any>,
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>,
) => {
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(false);
  const [model, setModel] = useState<blazeface.BlazeFaceModel | null>(null);
  useEffect(() => {
    const loadModel = async () => {
      await tf.ready();
      const loadedModel = await blazeface.load();
      setModel(loadedModel);
    };
    loadModel();
    const interval = setInterval(async () => {
      if (!model || !webcamRef.current || !canvasRef.current) return;

      const video = webcamRef.current.video;
      if (!video || video.readyState !== 4) return;

      // 먼저 BlazeFace로 얼굴 검출(두 번째 인자는 tensor 반환 여부; false)
      const predictions = await model.estimateFaces(video, false);

      // 영상의 실제 표시 크기를 가져옵니다.
      const videoRect = video.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const canvas = canvasRef.current;

      // canvas의 내부 해상도는 표시 크기에 devicePixelRatio를 곱하여 설정하고,
      // style은 표시 크기를 그대로 사용합니다.
      canvas.width = videoRect.width * dpr;
      canvas.height = videoRect.height * dpr;
      canvas.style.width = `${videoRect.width}px`;
      canvas.style.height = `${videoRect.height}px`;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        // 매 프레임마다 transform을 재설정하여 dpr 반영 (누적 방지)
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, videoRect.width, videoRect.height);

        // intrinsic(카메라) 해상도와 표시되는 크기 사이의 scale factor 계산
        const scaleX = videoRect.width / video.videoWidth;
        const scaleY = videoRect.height / video.videoHeight;

        predictions.forEach((prediction) => {
          const [x, y] = prediction.topLeft as [number, number];
          const [x2, y2] = prediction.bottomRight as [number, number];
          const boxWidth = (x2 - x) * scaleX;
          const boxHeight = (y2 - y) * scaleY;
          // 웹캠 영상은 mirroring(좌우 반전)이 적용되어 있으므로,
          // 검출 영역도 반대로 그려야 합니다.
          const adjustedX = videoRect.width - x * scaleX - boxWidth;
          const adjustedY = y * scaleY;

          ctx.strokeStyle = 'red';
          ctx.lineWidth = 2;
          ctx.strokeRect(adjustedX, adjustedY, boxWidth, boxHeight);

          // (선택 사항) 얼굴 랜드마크 보정 - x 좌표를 반전 처리합니다.
          if (prediction.landmarks) {
            prediction.landmarks.forEach((landmark) => {
              const [lx, ly] = landmark as [number, number];
              const adjustedLX = videoRect.width - lx * scaleX;
              const adjustedLY = ly * scaleY;
              ctx.fillStyle = 'blue';
              ctx.fillRect(adjustedLX - 2, adjustedLY - 2, 4, 4);
            });
          }
        });
      }

      // 얼굴이 검출되고 인증 중이 아니면 verifyFace 호출
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

    return () => clearInterval(interval);
  }, [isVerifying, webcamRef, canvasRef, model, navigate]);
  /**
verifyFace 함수
얼굴이 검출되면 서버에 POST 요청을 보내어 인증 후 페이지 이동을 진행합니다.
*/
  const verifyFace = async () => {
    try {
      const response = await fetch(
        'http://192.168.30.189:5000/user/face-login',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        },
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
