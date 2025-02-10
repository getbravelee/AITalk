import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
// 아래 수정해서 객체인식 완료해야 함
// import * as cocoSsd from '../@tensorflow-models/coco-ssd';
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
      if (model && webcamRef.current && webcamRef.current.video?.readyState === 4) {
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
            ctx.clearRect(0, 0, videoWidth, videoHeight);
            // coco-ssd 모델로 객체 감지
            const predictions = await model.detect(video);
            predictions.forEach(prediction => {
              const [x, y, width, height] = prediction.bbox;
              ctx.strokeStyle = '#00FFFF';
              ctx.lineWidth = 2;
              ctx.strokeRect(x, y, width, height);
              ctx.font = '18px Arial';
              ctx.fillStyle = '#00FFFF';
              const text = `${prediction.class} ${Math.round(prediction.score * 100)}%`;
              ctx.fillText(text, x, y > 10 ? y - 10 : y + 20);
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

export default CameraBox;
