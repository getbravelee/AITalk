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
  const navigate = useNavigate()
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <p>{message}</p>
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button variant="outline" onClick={() => {
              if (title === '얼굴 등록') {
                navigate('/TherapistFaceResisterCompletePage')
              }
              else if (title === '아이 얼굴 등록') {
                alert("아이의 얼굴 등록이 완료되었습니다.")
              }
              else if (title === '아이 얼굴 인식') {
                navigate('/MenuPage')
              }
              else {
                navigate('/HomeAfterLoginPage')  
              }
            }}>Cancel</Button>
          </DialogActionTrigger>
          <Button>Save</Button>
        </DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
}
