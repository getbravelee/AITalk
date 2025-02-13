// src/components/Dialogs/CameraDialog.tsx
import React, { useRef, useState } from 'react';
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
import Webcam from 'react-webcam';
import UseFaceVerification from '../../hooks/UseFaceVerification';

interface CameraDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  from: string;
  isSmall: boolean;
}

export default function CameraDialog({
  isOpen,
  onClose,
  title,
  message,
  from,
  isSmall,
}: CameraDialogProps) {
  // 얼굴 인식 아이콘 이미지 경로 (크기에 따라 분리)
  const faceIdImage: string = 'src/assets/Login/FaceID.svg';
  const faceIdImageSmall: string = 'src/assets/Login/FaceID_small.svg';
  const navigate = useNavigate();

  // Webcam과 Canvas에 대한 DOM 참조
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // 중복 인증 요청을 방지하기 위한 상태 변수
  const [isVerifying, setIsVerifying] = useState(false);

  // UseFaceVerification hook을 호출하여 얼굴 인식 및 인증 로직을 실행합니다.
  UseFaceVerification(webcamRef, canvasRef);

  return (
    <DialogRoot size={'xs'} placement="center">
      <DialogTrigger asChild>
        <Button
          bg="transparent"
          _hover={{ bg: 'transparent' }}
          _active={{ bg: 'transparent' }}
        >
          <img src={isSmall ? faceIdImageSmall : faceIdImage} alt="얼굴인식" />
        </Button>
      </DialogTrigger>
      <DialogContent position="relative">
        {/* Webcam 컴포넌트: 얼굴을 캡쳐하고 영상을 출력 */}
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{ facingMode: 'user' }}
          style={{ width: '100%', borderRadius: '8px' }}
          mirrored={true}
        />
        {/* Canvas: 얼굴 검출 결과(박스, 랜드마크)를 Webcam 영상 위에 표시 */}
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
          }}
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
                // from prop에 따라 다른 페이지로 이동
                if (from === 'thera_face') {
                  navigate('/KidFaceLoginPage');
                } else {
                  navigate('/play-select');
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
