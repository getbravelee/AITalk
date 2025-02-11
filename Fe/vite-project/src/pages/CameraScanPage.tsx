import { useEffect, useRef, useState } from 'react';
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

      // ✅ 비디오가 아직 준비되지 않았다면 대기
      if (video.readyState !== 4) {
        console.warn('⏳ 비디오가 아직 준비되지 않았습니다.');
        requestAnimationFrame(detectObjects);
        return;
      }

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      // ✅ detectObjects() 함수 내에서 추가!
      canvas.width = video.videoWidth || video.clientWidth;
      canvas.height = video.videoHeight || video.clientHeight;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const predictions: DetectedObject[] = await model.detect(video);
      // console.log(`🔎 감지된 객체 개수: ${predictions.length}`);
      // console.log(predictions);

      setIsDetecting(predictions.length > 0);

      predictions.forEach((prediction: DetectedObject) => {
        const [x, y, width, height] = prediction.bbox;

        // console.log(
        // `🟢 감지된 객체: ${prediction.class} (확률: ${prediction.score})`,
        // );
        // console.log(`📍 좌표: x=${x}, y=${y}, w=${width}, h=${height}`);

        ctx.strokeStyle = 'rgba(0, 255, 0, 0.8)';
        ctx.lineWidth = 7;
        // console.log(
        // `📍 박스 그리기: x=${x}, y=${y}, width=${width}, height=${height}`,
        // );
        ctx.strokeRect(x, y, width, height);

        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(
          x,
          y - 24,
          ctx.measureText(prediction.class).width + 10,
          20,
        );

        ctx.fillStyle = '#00FF00';
        ctx.font = '16px Arial';
        ctx.fillText(
          `${prediction.class} (${Math.round(prediction.score * 100)}%)`,
          x + 5,
          y - 5,
        );
      });

      animationId = requestAnimationFrame(detectObjects);
    };

    // ✅ 비디오가 로드될 때 감지 시작
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
        <div className="WebCamContainer">
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
