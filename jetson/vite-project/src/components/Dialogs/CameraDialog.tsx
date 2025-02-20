// src/components/Dialogs/CameraDialog.tsx
import React, { useState, useEffect } from 'react';
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
import UseFaceVerification from '../../hooks/UseFaceVerification';

interface CameraDialogProps {
  title: string;
  message: string;
  from: string;
  isSmall: boolean;
}

export default function CameraDialog({
  title,
  message,
  from,
  isSmall,
}: CameraDialogProps) {
  // 얼굴 인식 아이콘 이미지 경로 (크기에 따라 분리)
  const faceIdImage: string = 'images/login/FaceID.svg';
  const faceIdImageSmall: string = 'images/login/FaceID_small.svg';
  const navigate = useNavigate();
  const handleFaceVerification = UseFaceVerification()
  const [isCameraDialogOpen, setIsCameraDialogOpen] = useState(false);

  useEffect(() => {
    if (isCameraDialogOpen) {
      handleFaceVerification
    }
  }, [isCameraDialogOpen]);
  
  // 중복 인증 요청을 방지하기 위한 상태 변수
  // const [isVerifying, setIsVerifying] = useState(false);

  return (
    <DialogRoot size={'xs'} placement="center">
      <DialogTrigger asChild>
        <Button
          bg="transparent"
          _hover={{ bg: 'transparent' }}
          _active={{ bg: 'transparent' }}
          onClick={() => setIsCameraDialogOpen(true)}
        >
          <img src={isSmall ? faceIdImageSmall : faceIdImage} alt="얼굴인식" />
        </Button>
      </DialogTrigger>
      {isCameraDialogOpen && (
        <DialogContent position="relative">
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
      )}
    </DialogRoot>
  );
}
