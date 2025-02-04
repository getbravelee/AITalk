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

interface CameraDialogProps {
  isOpen: boolean;
  onClose: () => void;
}
export default function CameraDialog({ isOpen, onClose }: CameraDialogProps) {
  const faceIdImage: string = 'src/assets/Login/FaceID.png';
  return (
    <DialogRoot>
      <DialogTrigger asChild>
        <Button
          pl={1000}
          pt={200}
          bg="transparent"
          _hover={{ bg: 'transparent' }}
          _active={{ bg: 'transparent' }}
        >
          <img src={faceIdImage} alt="얼굴인식" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>얼굴 등록</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <p>
            이곳에 카메라를 통해 얼굴을 인식하는 기능을 넣어주세요.
          </p>
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button variant="outline">Cancel</Button>
          </DialogActionTrigger>
          <Button>Save</Button>
        </DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
}
