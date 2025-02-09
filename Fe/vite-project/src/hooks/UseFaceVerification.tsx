import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as faceapi from 'face-api.js';

/**
 * UseFaceVerification hook
 * 
 * @param webcamRef - React ref 객체로 Webcam 컴포넌트의 비디오 요소에 접근합니다.
 * @param canvasRef - React ref 객체로 얼굴 검출 결과를 그릴 canvas 요소에 접근합니다.
 * 
 * 이 hook은 다음 기능을 수행합니다.
 * 1. 얼굴 인식을 위한 모델을 로드합니다.
 * 2. 주기적으로 webcam 영상을 분석해 얼굴과 랜드마크를 검출하고, 캔버스에 오버레이합니다.
 * 3. 얼굴이 검출되면, webcam에서 캡쳐한 이미지를 서버에 전송하여 인증을 시도합니다.
 * 4. 인증 성공 시 페이지 이동을 수행합니다.
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
    // 모델 로드: tinyFaceDetector와 faceLandmark68Net 모델을 faceDetectModel 경로에서 불러옵니다.
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri(faceDetectModel);
      await faceapi.nets.faceLandmark68Net.loadFromUri(faceDetectModel);
    };
    loadModels();

    // 주기적으로 webcam 영상을 분석하는 interval을 시작 (100ms 주기)
    const interval = setInterval(async () => {
      if (webcamRef.current && canvasRef.current) {
        const video = webcamRef.current.video;
        // 비디오 요소가 준비되지 않았다면 건너뜁니다.
        if (!video || video.readyState !== 4) return;

        // 얼굴 검출과 랜드마크 인식을 수행합니다.
        const detections = await faceapi
          .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks();

        const canvas = canvasRef.current;
        // video의 실제 렌더링 영역 크기를 기준으로 캔버스 크기를 설정합니다.
        const rect = video.getBoundingClientRect();
        const displaySize = { width: rect.width, height: rect.height };
        canvas.width = rect.width;
        canvas.height = rect.height;
        faceapi.matchDimensions(canvas, displaySize);

        // 검출 결과를 화면 크기에 맞게 조정합니다.
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        const context = canvas.getContext('2d');
        if (context) {
          context.clearRect(0, 0, canvas.width, canvas.height);
          // 얼굴 영역과 랜드마크를 캔버스에 그립니다.
          faceapi.draw.drawDetections(canvas, resizedDetections);
          faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        }

        // 얼굴이 검출되었고, 현재 인증 요청이 진행 중이 아니라면 인증 로직을 실행합니다.
        if (!isVerifying && detections.length > 0) {
          setIsVerifying(true);
          // 웹캠의 현재 프레임을 캡쳐하여 base64 문자열로 반환합니다.
          const faceSnapshot = webcamRef.current.getScreenshot();
          if (faceSnapshot) {
            await verifyFace(faceSnapshot);
          } else {
            setIsVerifying(false);
          }
        }
      }
    }, 100); // 100ms 간격 실행

    // 컴포넌트 언마운트 시 interval 정리
    return () => clearInterval(interval);
  }, [isVerifying, webcamRef, canvasRef, navigate, faceDetectModel]);

  /**
   * verifyFace 함수
   * 캡쳐한 얼굴 이미지(faceImage)를 서버에 전송하여 인증 여부를 확인합니다.
   * 인증 성공 시 지정된 페이지로 이동하며, 호출 중 발생한 에러를 콘솔에 기록합니다.
   * 인증 후 isVerifying 상태는 false로 리셋됩니다.
   *
   * @param faceImage - Webcam에서 캡쳐한 base64 형식의 얼굴 이미지
   */
  const verifyFace = async (faceImage: string) => {
    try {
      const response = await fetch('http://192.168.30.193:5000/user/face-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: faceImage }),
      });
      const data = await response.json();
      // 서버가 인증된 사용자임을 응답하면 지정된 페이지로 이동합니다.
      if (data?.authenticated) {
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
