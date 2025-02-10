import { useState, useEffect } from 'react';
import * as ml5 from 'ml5';

interface DetectionResult {
  label: string;
  confidence: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export const useObjectDetector = (video: HTMLVideoElement | null) => {
  const [detections, setDetections] = useState<DetectionResult[]>([]);

  useEffect(() => {
    if (!video) return;

    let objectDetector: any;

    // COCO-SSD 모델 로드 및 감지 시작
    const loadModel = async () => {
      objectDetector = await ml5.objectDetector('cocossd', {}, () => {
        console.log('Model Loaded!');
        detectObjects();
      });
    };

    const detectObjects = () => {
      if (!objectDetector || !video) return;

      objectDetector.detect(video, (err: any, results: DetectionResult[]) => {
        if (err) {
          console.error(err);
          return;
        }
        setDetections(results);
        requestAnimationFrame(detectObjects); // 계속해서 감지 실행
      });
    };

    loadModel();

    return () => {
      objectDetector = null; // 모델 정리
    };
  }, [video]);

  return detections;
};
