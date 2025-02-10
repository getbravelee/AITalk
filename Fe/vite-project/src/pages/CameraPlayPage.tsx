import React, { useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import '../components/Common/BackgroundContainer.css';
import NavbarContainer from '../components/Common/NavbarContainer';
import BackButton from '../components/Common/BackButton';

export default function CameraPlayPage() {
  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: 'user', // 전면 카메라 사용
  };

  // 브라우저 확대 정도에 따른 스케일 팩터(100%에서는 1, 예: 250%에서는 1/2.5 = 0.4)
  const [scaleFactor, setScaleFactor] = useState(1);

  useEffect(() => {
    const updateScaleFactor = () => {
      // window.devicePixelRatio는 브라우저 확대 값을 반영 (예: 250% zoom의 경우 약 2.5)
      const currentScale = 1 / window.devicePixelRatio;
      setScaleFactor(currentScale);
    };

    updateScaleFactor();
    window.addEventListener('resize', updateScaleFactor);

    return () => window.removeEventListener('resize', updateScaleFactor);
  }, []);

  return (
    <div className="BackgroundContainer">
      <NavbarContainer>
        <BackButton />
      </NavbarContainer>

      {/* 전체 높이를 네비게이션 바를 제외한 영역으로 설정 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 'calc(100vh - 60px)',
        }}
      >
        {/* 카메라 박스 컨테이너: 기본 크기는 videoConstraints 기준이며, transform으로 스케일 조정 */}
        <div
          style={{
            width: videoConstraints.width,
            height: videoConstraints.height,
            borderRadius: 15,
            overflow: 'hidden',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
            transform: `scale(${scaleFactor})`,
            transformOrigin: 'center center',
          }}
        >
          <Webcam
            audio={false}
            videoConstraints={videoConstraints}
            screenshotFormat="image/jpeg"
            mirrored
          />
        </div>
      </div>
    </div>
  );
}
