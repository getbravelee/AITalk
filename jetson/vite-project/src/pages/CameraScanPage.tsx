import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [model, setModel] = useState<ReturnType<typeof cocoSsd.load> | null>(
    null,
  );
  const [isDetecting, setIsDetecting] = useState(false);

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
        console.warn('⏳ 비디오가 아직 준비되지 않았습니다.');
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

      // 🎯 특정 객체(person) 제외
      const filteredPredictions = predictions.filter(
        (prediction) => prediction.class !== 'person',
      );

      setIsDetecting(filteredPredictions.length > 0);

      filteredPredictions.forEach((prediction) => {
        const [x, y, width, height] = prediction.bbox;

        // ✅ 박스만 표시 (이름과 확률 제거)
        ctx.strokeStyle = 'rgba(0, 255, 0, 0.8)'; // 테두리 색
        ctx.lineWidth = 7;
        ctx.strokeRect(x, y, width, height);
      });

      animationId = requestAnimationFrame(detectObjects);
    };

    if (videoRef.current) {
      videoRef.current.onloadedmetadata = () => {
        console.log('🎥 비디오 메타데이터 로드 완료! 객체 감지 시작.');
        detectObjects();
      };
    }

    return () => cancelAnimationFrame(animationId);
  }, [model]);

  return (
    <div>
      <NavbarContainer>
        <BackPlaySelectButton />
      </NavbarContainer>
      <div className="CameraScanContainer">
        <div
          className="WebCamContainer"
          onClick={() => navigate('/camera-img-generate')}
        >
          <p>
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
