// src/components/Dialogs/ResistCameraDialog.tsx
import React, { useRef, useState } from 'react';
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogRoot,
} from '../ui/dialog';
import { Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import UseFaceResistration from '../../hooks/UseFaceRegistration';

interface ResistCameraDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  from: string;
  isSmall: boolean;
  cardData: { therapist_id: number; name: string }; // NFC 카드에서 읽은 사용자 정보
}

export default function ResistCameraDialog({
  isOpen,
  onClose,
  title,
  message,
  from,
  isSmall,
  cardData,
}: ResistCameraDialogProps) {
  // 얼굴 아이콘 경로 (상황에 따라 작은 이미지나 기본 이미지 선택)
  const faceIdImage: string = 'src/assets/Login/FaceID.svg';
  const faceIdImageSmall: string = 'src/assets/Login/FaceID_small.svg';
  const navigate = useNavigate();

  // webcam 및 canvas DOM 접근을 위한 ref
  const webcamRef = useRef<any>(null);
  const canvasRef = useRef<any>(null);
  // 얼굴 등록 요청 중복 방지를 위한 상태
  const [isVerifying, setIsVerifying] = useState(false);

  // useFaceRegistration hook을 호출하여 얼굴 인식 및 등록 로직 실행
  UseFaceResistration(webcamRef, canvasRef, isVerifying, setIsVerifying, cardData);

  return (
    <DialogRoot size={'xs'} placement="center">
      <DialogTrigger asChild>
        <Button bg="transparent">
          <img src={isSmall ? faceIdImageSmall : faceIdImage} alt="얼굴인식" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        {/* Webcam 컴포넌트: 뒤에 캔버스와 함께 얼굴 검출 결과를 표시 */}
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{ facingMode: 'user' }}
          style={{ width: '100%', borderRadius: '8px' }}
          mirrored={true}
        />
        {/* 캔버스: 얼굴 검출 결과(박스/랜드마크) 오버레이 */}
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            // transform: 'scaleX(-1)',
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
                if (from === 'thera_face') {
                  navigate('/KidFaceLoginPage');
                } else {
                  alert("아이 얼굴 등록 완료");
                }
              }}
            >
              Cancel
            </Button>
          </DialogActionTrigger>
          {/* Save 버튼: 추가 동작을 위한 옵션 (필요시)를 제공합니다. */}
          <Button>Save</Button>
        </DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
}
