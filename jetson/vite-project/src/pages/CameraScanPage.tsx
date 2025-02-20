import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CurrentUserText from '../components/Texts/CurrentUserText';
import LogoutButton from '../components/Buttons/LogoutButton';
import NavbarContainer from '../components/Common/NavbarContainer';
import BackPlaySelectButton from '../components/Common/BackPlaySelectButton';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import * as tf from '@tensorflow/tfjs';
import { HStack } from '@chakra-ui/react';
import './CameraScanPage.css';
import { useSelector } from 'react-redux';
import { RootState } from '../feature/store';

// ✅ 직접 DetectedObject 타입 정의
type DetectedObject = {
  bbox: [number, number, number, number]; // [x, y, width, height]
  class: string;
  score: number;
};

export default function CameraScanPage() {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const navigate = useNavigate();
  const location = useLocation();
  const scheduleId = location.state?.scheduleId; // PlaySelectPage에서 전달받은 값
  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [model, setModel] = useState<ReturnType<typeof cocoSsd.load> | null>(
    null,
  );
  const [isDetecting, setIsDetecting] = useState(false);
  const isDataSentRef = useRef(false); // ✅ 중복 실행 방지용 useRef
  const isDetectingRef = useRef(true);

  // ✅ 추가된 변수 (객체 인식 유지 시간 체크)
  const CONFIDENCE_THRESHOLD = 0.7; // 최소 확률 임계값
  const DETECTION_DURATION = 1000; // 유지해야 하는 시간(ms)

  let detectedObject: string | null = null;
  let detectedStartTime: number | null = null;

  useEffect(() => {
    // ✅ 모델 로드
    const loadModel = async () => {
      await tf.ready();
      const loadedModel = await cocoSsd.load();
      setModel(loadedModel);
      console.log('✅ COCO-SSD 모델 로드 완료');
    };

    loadModel();
  }, []);

  useEffect(() => {
    // startCamera 함수가 비디오 엘리먼트에 연결한 스트림을 streamRef에 저장하도록 수정
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' },
        });
        // stream을 별도의 ref에 저장
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('❌ 카메라 접근 오류:', error);
      }
    };

    startCamera();

    // ✅ cleanup: 컴포넌트 언마운트 시 camera 스트림 종료
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        console.log('✅ 카메라 스트림 종료 완료');
      }
    };
  }, []);

  useEffect(() => {
    let animationId: number;

    const detectObjects = async () => {
      if (!model || !videoRef.current || !canvasRef.current) return;
      if (isDataSentRef.current || !isDetectingRef.current) return; // ✅ 데이터가 전송되었거나 객체 인식이 비활성화되면 종료

      const video = videoRef.current;
      if (video.readyState !== 4) {
        requestAnimationFrame(detectObjects);
        return;
      }

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = video.videoWidth || video.clientWidth;
      canvas.height = video.videoHeight || video.clientHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const predictions: DetectedObject[] = await model.detect(video);

      // ✅ 'person' 객체는 아예 필터링 (화면에 표시 X)
      const filteredPredictions = predictions.filter(
        (prediction) => prediction.class !== 'person',
      );

      // ✅ 모든 감지된 객체를 화면에 표시 (person 제외)
      filteredPredictions.forEach((prediction) => {
        const [x, y, width, height] = prediction.bbox;
        ctx.strokeStyle = 'rgba(0, 255, 0, 0.8)';
        ctx.lineWidth = 7;
        ctx.strokeRect(x, y, width, height);

        ctx.fillStyle = 'rgba(0, 255, 0, 0.8)';
        ctx.font = '18px Arial';
        ctx.fillText(
          `${prediction.class} (${(prediction.score * 100).toFixed(1)}%)`,
          x,
          y - 5,
        );
      });

      // ✅ 특정 객체(person 제외) + 확률 0.7 이상인 경우만 유지 시간 체크
      const highConfidencePredictions = filteredPredictions.filter(
        (prediction) => prediction.score >= CONFIDENCE_THRESHOLD,
      );

      if (highConfidencePredictions.length > 0) {
        const bestPrediction = highConfidencePredictions[0]; // 확률이 가장 높은 객체
        const objectName = bestPrediction.class;
        setIsDetecting(true); // 감지 중 상태 설정

        if (detectedObject === objectName) {
          // 같은 객체가 계속 감지되는 경우
          if (
            detectedStartTime &&
            Date.now() - detectedStartTime >= DETECTION_DURATION
          ) {
            sendToBackend(objectName);
            detectedObject = null; // 한 번 보냈으면 초기화
            detectedStartTime = null;
          }
        } else {
          // 새로운 객체가 감지됨 → 타이머 초기화
          detectedObject = objectName;
          detectedStartTime = Date.now();
        }
      } else {
        // 감지된 객체가 없으면 초기화
        setIsDetecting(false);
        detectedObject = null;
        detectedStartTime = null;
      }

      animationId = requestAnimationFrame(detectObjects);
    };

    if (videoRef.current) {
      videoRef.current.onloadedmetadata = () => {
        detectObjects();
      };
    }

    return () => cancelAnimationFrame(animationId);
  }, [model]);

  // ✅ 백엔드 전송 함수 수정 (데이터 전송 후 state와 함께 페이지 이동)
  const sendToBackend = async (objectName: string) => {
    if (!scheduleId) {
      console.error('❌ scheduleId가 없습니다.');
      return;
    }

    if (isDataSentRef.current) {
      console.log('⚠️ 이미 데이터가 전송됨. 중복 전송 방지');
      isDetectingRef.current = false;
      return;
    }

    const data = {
      schedule_id: scheduleId,
      word: objectName,
    };

    console.log('📤 백엔드로 데이터 전송:', data);
    isDataSentRef.current = true;
    isDetectingRef.current = false;

    // ✅ 백엔드 응답 없이 먼저 페이지 이동 (백엔드 응답을 기다리지 않음)
    navigate('/camera-img-generate', { state: { data } });

    try {
      const response = await fetch('http://localhost:5000/play/camera-scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`❌ 서버 응답 오류: ${response.status}`);
      }

      console.log('✅ 데이터 전송 성공!');
      const imageData = await response.json();

      // ✅ 백엔드 응답을 다음 페이지에서 업데이트하도록 설정
      window.dispatchEvent(
        new CustomEvent('backendResponse', { detail: imageData }),
      );
    } catch (error) {
      console.error('❌ 데이터 전송 실패:', error);
      isDataSentRef.current = false;
      isDetectingRef.current = true;
    }
  };

  return (
    <div className="BackgroundContainer">
      <div className="BackgroundImage"></div>
      <NavbarContainer>
        <HStack gap={315}>
          <BackPlaySelectButton className="CustomMarginTop" />
          {/* 로그인 한 경우에만 치료사의 이름이 렌더링되도록 함함 */}
          {currentUser && (
            <HStack gap={10}>
              <CurrentUserText />
              <LogoutButton />
            </HStack>
          )}
        </HStack>
      </NavbarContainer>
      <div className="CameraScanContainer">
        <div className="WebCamContainer">
          <p className="CameraScanTextContainer">
            물건을 화면의 <span className="highlight">중앙에</span> 맞춰서
            보여주세요 !
          </p>
          {/* ✅ 웹캠 화면 출력 */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="CameraFeed"
          ></video>

          {/* ✅ 객체 감지 캔버스 */}
          <canvas
            ref={canvasRef}
            className={`ObjectDetectionCanvas ${isDetecting ? 'active' : ''}`}
          ></canvas>
        </div>
      </div>
    </div>
  );
}
