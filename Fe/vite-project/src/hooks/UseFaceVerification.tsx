import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as faceapi from 'face-api.js';

/**
 * UseFaceVerification hook
 * 
 * @param webcamRef - React ref 객체로 Webcam 컴포넌트의 비디오 요소에 접근합니다.
 * @param canvasRef - React ref 객체로 얼굴 검출 결과를 그릴 canvas 요소에 접근합니다.
 *
 * 이 hook은 얼굴 인식을 위한 모델을 로드하고, 주기적으로 webcam 영상을 분석해 얼굴과 랜드마크를 검출합니다.
 * 검출된 결과는 canvas에 오버레이되고, 얼굴이 검출되면 시각적 인식을 진행하는 효과만 보여줍니다.
 * 실제 인증을 위한 데이터는 서버로 넘기지 않습니다.
 */
const UseFaceVerification = (
  webcamRef: React.MutableRefObject<any>,
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>
) => {
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(false);
  // 모델 파일들이 위치한 public 내 디렉토리 경로 (모델 매니페스트 위치)
  const faceDetectModel = '/Model';

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri(faceDetectModel);
      await faceapi.nets.faceLandmark68Net.loadFromUri(faceDetectModel);
    };
    loadModels();

    const interval = setInterval(async () => {
      if (webcamRef.current && canvasRef.current) {
        const video = webcamRef.current.video;
        if (!video || video.readyState !== 4) return;

        const detections = await faceapi
          .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks();

        const canvas = canvasRef.current;
        const rect = video.getBoundingClientRect();
        const displaySize = { width: rect.width, height: rect.height };
        canvas.width = rect.width;
        canvas.height = rect.height;
        faceapi.matchDimensions(canvas, displaySize);

        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        const context = canvas.getContext('2d');
        if (context) {
          context.clearRect(0, 0, canvas.width, canvas.height);
          faceapi.draw.drawDetections(canvas, resizedDetections);
          faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        }

        // 얼굴이 검출되었고, 현재 인증 요청이 진행 중이 아니라면 시각화 효과를 수행합니다.
        if (!isVerifying && detections.length > 0) {
          setIsVerifying(true);
          // 현재 프레임의 캡쳐 이미지를 얻지만, 서버로 전송하지 않습니다.
          const faceSnapshot = webcamRef.current.getScreenshot();
          if (faceSnapshot) {
            await verifyFace();
          } else {
            setIsVerifying(false);
          }
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isVerifying, webcamRef, canvasRef, navigate, faceDetectModel]);

  /**
   * verifyFace 함수
   *
   * 얼굴 인증 시각화를 위해 서버에 POST 요청을 보내지만, 더 이상 인증 데이터는 전달하지 않습니다.
   * 서버에서 응답하는 authenticated 값에 따라 페이지 이동 또는 에러 처리를 수행합니다.
   *
   */
  const verifyFace = async () => {
    try {
      const response = await fetch('http://192.168.30.189:5000/user/face-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      
      if (Number(data?.status) === 200) {
        alert(`안녕하세요 ${data.therapist_name}님!`)
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
