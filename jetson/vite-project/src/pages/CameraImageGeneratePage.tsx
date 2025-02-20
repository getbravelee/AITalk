import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import NavbarContainer from '../components/Common/NavbarContainer';
import BackPlaySelectButton from '../components/Common/BackPlaySelectButton';
import ImgGenerateText from '../components/Texts/ImgGenerateText';
import LoadingCircle from '../components/Common/LoadingCircle';
import ImgGenerateImage from '../components/Images/ImgGenerateImage';

import './CameraImageGeneratePage.css';

export default function CameraImageGeneratePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [imageData, setImageData] = useState(location.state?.imageData || null);
  const data = location.state?.data;
  const [isTimeoutPassed, setIsTimeoutPassed] = useState(false);
  const [startTime] = useState(Date.now()); // ✅ 시작 시간을 기록

  console.log('📸 받은 이미지 데이터:', imageData);

  useEffect(() => {
    // ✅ 8초 후 이동 가능 상태로 변경
    const timeoutId = setTimeout(() => {
      setIsTimeoutPassed(true);
    }, 8000);

    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    // ✅ 페이지 이동 후, 백엔드 응답을 기다림
    const handleBackendResponse = (event: any) => {
      setImageData(event.detail);
    };

    window.addEventListener('backendResponse', handleBackendResponse);

    return () => {
      window.removeEventListener('backendResponse', handleBackendResponse);
    };
  }, []);

  useEffect(() => {
    if (imageData) {
      const elapsedTime = Date.now() - startTime; // ✅ 경과 시간 계산
      const remainingTime = Math.max(8000 - elapsedTime, 0); // ✅ 남은 시간 계산

      console.log(
        `⏳ 경과 시간: ${elapsedTime}ms, 남은 시간: ${remainingTime}ms`,
      );

      setTimeout(() => {
        console.log('✅ 페이지 이동:', imageData);
        navigate('/camera-play-select', {
          state: { imageUrl: imageData, data: data },
        });
      }, remainingTime);
    }
  }, [imageData, isTimeoutPassed, navigate, data, startTime]);

  return (
    <div>
      <NavbarContainer>
        <BackPlaySelectButton className="CustomMarginTop" />
      </NavbarContainer>
      <div className="CameraImageGenerateContainer">
        <ImgGenerateText />
        <LoadingCircle className="camera-loading-circle" />
        <ImgGenerateImage />
      </div>
    </div>
  );
}
