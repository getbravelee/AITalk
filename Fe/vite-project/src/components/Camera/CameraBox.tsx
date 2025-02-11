import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import * as tf from '@tensorflow/tfjs';
import { VideoConstraints } from './VideoConstraints';

interface CameraBoxProps {
  scaleFactor: number;
}

const CameraBox: React.FC<CameraBoxProps> = ({ scaleFactor }) => {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [model, setModel] = useState<cocoSsd.ObjectDetection | null>(null);

  // 모델 로드: tf.ready() 후 cocoSsd.load()를 이용해 모델을 비동기로 로드합니다.
  useEffect(() => {
    const loadModel = async () => {
      await tf.ready();
      const loadedModel = await cocoSsd.load();
      setModel(loadedModel);
    };
    loadModel();
  }, []);

  // 객체 감지 루프 실행: requestAnimationFrame으로 주기적으로 감지 결과를 캔버스에 그립니다.
  useEffect(() => {
    let animationId: number;
    const detectObjects = async () => {
      if (
        model &&
        webcamRef.current &&
        webcamRef.current.video?.readyState === 4
      ) {
        const video = webcamRef.current.video;
        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;

        // 웹캠과 캔버스 크기를 비디오 크기와 맞춥니다.
        if (webcamRef.current.video) {
          webcamRef.current.video.width = videoWidth;
          webcamRef.current.video.height = videoHeight;
        }

        const canvas = canvasRef.current;
        if (canvas) {
          canvas.width = videoWidth;
          canvas.height = videoHeight;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            // 기존 내용 지우기
            ctx.clearRect(0, 0, videoWidth, videoHeight);
            // 좌우 반전을 위해 캔버스 컨텍스트 변환 적용
            ctx.save();
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
            ctx.clearRect(0, 0, videoWidth, videoHeight);
            // coco-ssd 모델로 객체 감지
            // predictions 배열의 타입을 지정
            const predictions: Prediction[] = await model.detect(video);

            predictions.forEach((prediction) => {
              const [x, y, width, height] = prediction.bbox;

              // 1. 객체 인식 박스 그리기 (현재 좌우 반전 상태에서 그려짐)
              ctx.save();

              // 그림자 효과 설정
              ctx.shadowColor = 'rgba(0, 0, 0, 0.6)'; // 어두운 그림자
              ctx.shadowBlur = 8; // 블러 효과
              ctx.shadowOffsetX = 4; // 오른쪽 오프셋
              ctx.shadowOffsetY = 4; // 아래쪽 오프셋

              // 노란색 그라데이션 stroke 스타일 생성 (왼쪽 상단 → 오른쪽 상단)
              const lineGradient = ctx.createLinearGradient(x, y, x + width, y);
              lineGradient.addColorStop(0, '#FFD700'); // 골드 색상
              lineGradient.addColorStop(1, '#FFFACD'); // 레몬 치폰 색상

              ctx.lineWidth = 3;
              ctx.strokeStyle = lineGradient;
              ctx.strokeRect(x, y, width, height);

              ctx.restore();

              // 2. 텍스트는 좌우 반전되지 않도록 변환 초기화 후 그리기
              ctx.save();
              ctx.setTransform(1, 0, 0, 1, 0, 0); // 좌표계를 원래대로 복원

              // 반전되어 그려진 박스의 올바른 텍스트 좌표 계산:
              // 텍스트의 x 좌표는 캔버스 너비에서 (x+width)를 빼준 값에 약간의 여백을 더함
              const textX = canvas.width - (x + width) + 4;
              const textY = y > 22 ? y - 24 : y + 4;
              const text = `${prediction.class} ${Math.round(prediction.score * 100)}%`;

              // 텍스트 그라데이션 (상단부터 하단까지 핑크 계열)
              const textGradient = ctx.createLinearGradient(
                textX,
                textY,
                textX,
                textY + 25,
              );
              textGradient.addColorStop(0, '#FF69B4'); // 핫핑크
              textGradient.addColorStop(1, '#FF1493'); // 딥핑크

              ctx.font = 'bold 16px Arial';
              ctx.textBaseline = 'top';

              // 텍스트 가독성을 위한 반투명 배경 그리기
              const textWidth = ctx.measureText(text).width;
              ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
              ctx.fillRect(textX, textY, textWidth + 8, 24);

              // 텍스트를 그라데이션 색상으로 채워줌
              ctx.fillStyle = textGradient;
              ctx.fillText(text, textX + 4, textY + 2);

              ctx.restore();
            });
          }
        }
      }
      animationId = requestAnimationFrame(detectObjects);
    };

    detectObjects();
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [model]);

  return (
    <div
      style={{
        position: 'relative',
        width: VideoConstraints.width,
        height: VideoConstraints.height,
        borderRadius: 15,
        overflow: 'hidden',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
        transform: `scale(${scaleFactor})`,
        transformOrigin: 'center center',
      }}
    >
      <Webcam
        audio={false}
        videoConstraints={VideoConstraints}
        screenshotFormat="image/jpeg"
        mirrored
        ref={webcamRef}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none', // 캔버스를 통해 인터랙션이 방해되지 않도록 설정합니다.
        }}
      />
    </div>
  );
};

interface Prediction {
  bbox: [number, number, number, number]; // [x, y, width, height]
  class: string; // 객체 클래스 이름
  score: number; // 신뢰도 점수 (0~1)
}

export default CameraBox;
