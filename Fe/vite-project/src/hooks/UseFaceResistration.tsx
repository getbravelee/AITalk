import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as faceapi from 'face-api.js';

/**
 * UseFaceRegistration hook
 * 
 * @param webcamRef - Webcam 컴포넌트의 ref로, 현재 비디오 요소에 접근합니다.
 * @param canvasRef - 얼굴 검출 결과를 그릴 canvas의 ref입니다.
 * @param isVerifying - 얼굴 등록 요청 진행 여부 (중복 요청 방지용 상태).
 * @param setIsVerifying - isVerifying 상태를 변경하는 함수.
 * 
 * 이 hook은 모델 로딩, 주기적 얼굴 검출 및 캡쳐 후 얼굴 등록 API 요청을 처리합니다.
 */
const UseFaceRegistration = (
  webcamRef: React.MutableRefObject<any>,
  canvasRef: React.MutableRefObject<any>,
  isVerifying: boolean,
  setIsVerifying: (verifying: boolean) => void
) => {
  const navigate = useNavigate();
  // 모델 파일들이 위치한 public 내 디렉터리 경로
  const faceDetectModel = '/Model';

  useEffect(() => {
    // 1. 얼굴 검출에 사용할 모델들을 로드합니다.
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri(faceDetectModel);
      await faceapi.nets.faceLandmark68Net.loadFromUri(faceDetectModel);
    };
    loadModels();

    // 2. 주기적으로 Webcam의 영상을 분석하여 얼굴 검출 시 등록 처리를 진행합니다.
    const interval = setInterval(async () => {
      if (webcamRef.current && canvasRef.current) {
        const video = webcamRef.current.video;
        // 비디오 요소가 준비되지 않았다면 중단합니다.
        if (!video || video.readyState !== 4) return;

        // 얼굴 검출 및 랜드마크 인식 실행
        const detections = await faceapi
          .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks();

        // 캔버스 크기를 비디오 표시 영역에 맞게 설정합니다.
        const canvas = canvasRef.current;
        const rect = video.getBoundingClientRect();
        const displaySize = { width: rect.width, height: rect.height };
        canvas.width = rect.width;
        canvas.height = rect.height;
        faceapi.matchDimensions(canvas, displaySize);

        // 검출 결과를 화면 크기에 맞게 조정합니다.
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        const context = canvas.getContext('2d');
        if (context) {
          // 이전 캔버스 내용을 지우고 얼굴 영역과 랜드마크를 그립니다.
          context.clearRect(0, 0, canvas.width, canvas.height);
          faceapi.draw.drawDetections(canvas, resizedDetections);
          faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

          // 3. 얼굴이 검출됐고, 아직 등록 요청 중이 아니라면 등록 함수 호출
          if (!isVerifying && detections.length > 0) {
            setIsVerifying(true); // 중복 등록 방지를 위해 true로 설정
            const faceSnapshot = webcamRef.current.getScreenshot();
            if (faceSnapshot) {
              await registerFace(faceSnapshot, navigate, setIsVerifying);
            } else {
              setIsVerifying(false);
            }
          }
        }
      }
    }, 100); // 100ms 주기로 검출

    return () => clearInterval(interval);
  }, [isVerifying, webcamRef, canvasRef, navigate, setIsVerifying, faceDetectModel]);
};

/**
 * registerFace 함수
 * 
 * 서버에 POST 요청을 보내어 캡쳐한 얼굴 이미지로 등록 처리를 진행합니다.
 * 
 * @param faceImage - Webcam에서 캡쳐한 base64 형식의 얼굴 이미지
 * @param navigate - 페이지 이동을 위한 react-router-dom의 함수
 * @param setIsVerifying - 등록 처리 후 상태 리셋 함수
 */
async function registerFace(
  faceImage: string,
  navigate: ReturnType<typeof useNavigate>,
  setIsVerifying: (verifying: boolean) => void
) {
  try {
    const response = await fetch('http://192.168.30.193:5000/user/face-resist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: faceImage }),
    });
    const data = await response.json();

    // 서버가 얼굴 등록 성공을 응답하면 페이지 이동 진행
    if (data?.registered) {
      console.log('얼굴 등록 성공:', data);
      navigate('/TherapistFaceResisterCompletePage');
    } else {
      console.error('얼굴 등록 실패:', data?.message || '');
    }
  } catch (error) {
    console.error('서버 요청 중 에러 발생:', error);
  } finally {
    setIsVerifying(false); // 등록 후 중복 요청 방지 플래그 리셋
  }
}

export default UseFaceRegistration;
