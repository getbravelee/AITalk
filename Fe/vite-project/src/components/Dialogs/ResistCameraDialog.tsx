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
import { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';

interface CameraDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  from: string;
  isSmall: boolean
  therapistID: number
}

export default function CameraDialog({
  isOpen,
  onClose,
  title,
  message,
  from,
  isSmall,
  therapistID
}: CameraDialogProps) {
  // FaceID 아이콘 이미지 경로
  const faceIdImage: string = 'src/assets/Login/FaceID.svg';
  const faceIdImageSmall: string = 'src/assets/Login/FaceID_small.svg';
  const navigate = useNavigate();
  // webcam과 캔버스 DOM에 접근하기 위한 ref
  const webcamRef = useRef<any>(null);
  const canvasRef = useRef<any>(null);
  // 중복 등록 요청 방지를 위해 상태 변수 사용
  const [isVerifying, setIsVerifying] = useState(false);
  // 모델 파일이 있는 public 폴더 내 디렉터리 (모델 매니페스트 및 관련 파일들을 포함)
  const faceDetectModel = '/Model';

  useEffect(() => {
    // 1. 얼굴 인식을 위한 모델들을 로드합니다.
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri(faceDetectModel);
      await faceapi.nets.faceLandmark68Net.loadFromUri(faceDetectModel);
    };
    loadModels();

    // 2. 일정 주기로 webcam 영상을 분석해서 얼굴 검출 및 등록을 시도합니다.
    const interval = setInterval(async () => {
      if (webcamRef.current && canvasRef.current) {
        const video = webcamRef.current.video;
        if (!video || video.readyState !== 4) return;

        // 얼굴 검출 및 랜드마크 인식 실행
        const detections = await faceapi
          .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks();

        const canvas = canvasRef.current;
        // 비디오가 실제 렌더링되는 영역에 맞추어 캔버스 크기 설정
        const rect = video.getBoundingClientRect();
        const displaySize = { width: rect.width, height: rect.height };
        canvas.width = rect.width;
        canvas.height = rect.height;
        faceapi.matchDimensions(canvas, displaySize);

        // 검출 결과를 현재 화면에 맞게 조정
        const resizedDetections = faceapi.resizeResults(
          detections,
          displaySize,
        );
        const context = canvas.getContext('2d');
        if (context) {
          context.clearRect(0, 0, canvas.width, canvas.height);
          // 얼굴 영역(박스)와 랜드마크를 캔버스에 오버레이
          faceapi.draw.drawDetections(canvas, resizedDetections);
          faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

          // 3. 얼굴이 검출되었고, 아직 등록 요청 진행 중이 아니라면…
          if (!isVerifying && detections.length > 0) {
            setIsVerifying(true);
            // webcam의 현재 프레임을 캡쳐 (base64 문자열)
            const faceSnapshot = webcamRef.current.getScreenshot();
            if (faceSnapshot) {
              // 얼굴 등록 API 호출
              registerFace(faceSnapshot);
            } else {
              setIsVerifying(false);
            }
          }
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isVerifying, navigate]);

  // 4. 서버에 얼굴 이미지를 전달하여 등록하는 함수입니다.
  // 추후 로그인 시 이 등록된 얼굴 정보와 비교하여 인증에 활용됩니다.
  const registerFace = async (faceImage: string) => {
    try {
      // POST 요청을 통해 서버의 얼굴 등록 엔드포인트에 이미지 데이터를 전달합니다.
      const response = await fetch(
        'http://192.168.30.193:5000/user/face-resist',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          // 전달되는 image 필드는 base64 문자열입니다.
          body: JSON.stringify({ image: faceImage }),
        },
      );
      const data = await response.json();

      // 서버 응답에서 얼굴 등록 성공 여부를 확인합니다.
      // 예를 들어, data.registered === true 라고 가정
      if (data?.registered) {
        console.log('얼굴 등록 성공:', data);
        // 등록이 완료되면 등록 완료 페이지 또는 원하는 페이지로 이동합니다.
        navigate('/TherapistFaceResisterCompletePage');
      } else {
        console.error('얼굴 등록 실패:', data?.message || '');
      }
    } catch (error) {
      console.error('서버 요청 중 에러 발생:', error);
    } finally {
      // 등록 처리 후 추가 등록 요청이 방지되도록 플래그 리셋
      setIsVerifying(false);
    }
  };

  return (
    <DialogRoot size={'xs'} placement="center">
      <DialogTrigger asChild>
        <Button bg="transparent">
          <img src={isSmall ? faceIdImageSmall : faceIdImage} alt="얼굴인식" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        {/* webcam 컴포넌트: mirrored 옵션으로 미러 이미지 제공 */}
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{ facingMode: 'user' }}
          style={{ width: '100%', borderRadius: '8px' }}
          mirrored={true}
        />
        {/* 캔버스: 얼굴 검출 결과(박스/랜드마크)를 영상 위에 오버레이 */}
        <canvas
          ref={canvasRef}
          style={{ position: 'absolute', top: 0, left: 0, transform: 'scaleX(-1)' }}
        />
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <p>{message}</p>
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button variant="outline" onClick={() => {
              if (from === 'thera_face') {
                navigate('/KidFaceLoginPage');
              }
              else {
                // 
                alert("아이 얼굴 등록 완료")
              }
            }}>
              Cancel
            </Button>
          </DialogActionTrigger>
          {/* Save 버튼은 수동 등록이나 추가 동작을 위해 사용할 수 있습니다. */}
          <Button>Save</Button>
        </DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
}
