import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import NavbarContainer from '../components/Common/NavbarContainer';
import BackPlaySelectButton from '../components/Common/BackPlaySelectButton';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import * as tf from '@tensorflow/tfjs';

import './CameraScanPage.css';

// ✅ 직접 DetectedObject 타입 정의
type DetectedObject = {
  bbox: [number, number, number, number]; // [x, y, width, height]
  class: string;
  score: number;
};

export default function CameraScanPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const scheduleId = location.state?.scheduleId; // PlaySelectPage에서 전달받은 값

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [model, setModel] = useState<ReturnType<typeof cocoSsd.load> | null>(
    null,
  );
  const [isDetecting, setIsDetecting] = useState(false);

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
    if (!videoRef.current) return;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('❌ 카메라 접근 오류:', error);
      }
    };

    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    let animationId: number;

    const detectObjects = async () => {
      if (!model || !videoRef.current || !canvasRef.current) return;

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

  // ✅ 백엔드 전송 함수 수정 (전송 후 페이지 이동)
  const sendToBackend = async (objectName: string) => {
    if (!scheduleId) {
      console.error('❌ scheduleId가 없습니다.');
      return;
    }

    const data = {
      scheduleId,
      word: objectName,
    };

    console.log('📤 백엔드로 데이터 전송:', data);

    try {
      const response = await fetch('/play/camera-scan', {
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

      // ✅ 백엔드로 데이터 전송 후 '/camera-img-generate'로 이동
      navigate('/camera-img-generate');
    } catch (error) {
      console.error('❌ 데이터 전송 실패:', error);
    }
  };

  return (
    <div>
      <NavbarContainer>
        <BackPlaySelectButton />
      </NavbarContainer>
      <div className="CameraScanContainer">
        <div className="WebCamContainer">
          <p>
            물건을 화면의 <span className="highlight">중앙에</span> 맞춰서
            보여주세요 !
          </p>

          {/* ✅ 감지 상태 표시 */}
          {isDetecting && (
            <p className="detection-status">🔍 객체 감지 중...</p>
          )}

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
