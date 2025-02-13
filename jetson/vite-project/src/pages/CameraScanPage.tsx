import { useEffect, useRef } from 'react';
import NavbarContainer from '../components/Common/NavbarContainer';
import BackPlaySelectButton from '../components/Common/BackPlaySelectButton';
import { useNavigate } from 'react-router-dom';

import './CameraScanPage.css';

export default function CameraScanPage() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    // ✅ 웹캠 활성화 로직
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' }, // 📸 전면 카메라 (PC에서는 기본 카메라)
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('❌ 카메라 접근 오류:', error);
      }
    };

    startCamera();

    return () => {
      // ✅ 컴포넌트 언마운트 시 카메라 스트림 종료
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div>
      <NavbarContainer>
        <BackPlaySelectButton />
      </NavbarContainer>
      <div className="CameraScanContainer">
        <div className="WebCamContainer">
          <p>
            물건을 화면의 <span className="highlight">중앙에</span> 맞춰서
            보여주세요 !
          </p>

          {/* ✅ 웹캠 화면 출력 */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            onClick={() => navigate('/camera-img-generate')}
            className="CameraFeed"
          ></video>
        </div>
      </div>
    </div>
  );
}
