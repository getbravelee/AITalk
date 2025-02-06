import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import React, { useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';

interface CameraDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}
export default function CameraDialog({
  isOpen,
  onClose,
  title,
  message,
}: CameraDialogProps) {
  const faceIdImage: string = 'src/assets/Login/FaceID.png';
  const navigate = useNavigate();
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const MODEL_1_URL = '/Model'
  // const MODEL_2_URL = '/Model/face_landmark_68_model-shard1';

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_1_URL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_1_URL);
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
        const displaySize = {
          width: video.videoWidth,
          height: video.videoHeight,
        };
        faceapi.matchDimensions(canvas, displaySize);

        const resizedDetections = faceapi.resizeResults(
          detections,
          displaySize,
        );
        const context = canvas.getContext('2d');
        if (context) {
          context.clearRect(0, 0, canvas.width, canvas.height);
          faceapi.draw.drawDetections(canvas, resizedDetections);
          faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <DialogRoot>
      <DialogTrigger asChild>
        <Button
          bg="transparent"
          _hover={{ bg: 'transparent' }}
          _active={{ bg: 'transparent' }}
        >
          <img src={faceIdImage} alt="얼굴인식" />
        </Button>
      </DialogTrigger>
      <DialogContent position='relative'>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{ facingMode: 'user' }}
          style={{ width: '100%', borderRadius: '8px' }}
          mirrored={true}
        />
        <canvas
          ref={canvasRef}
          style={{ position: 'absolute', top: 0, left: 0 }}
        />
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <p>{message}</p>
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button
              variant="outline"
              onClick={() => {
                if (title === '얼굴 등록') {
                  navigate('/TherapistFaceResisterCompletePage');
                } else if (title === '아이 얼굴 등록') {
                  alert('아이의 얼굴 등록이 완료되었습니다.');
                } else if (title === '아이 얼굴 인식') {
                  navigate('/MenuPage');
                } else {
                  navigate('/HomeAfterLoginPage');
                }
              }}
            >
              Cancel
            </Button>
          </DialogActionTrigger>
          <Button>Save</Button>
        </DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
}
