import { useEffect } from 'react';
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
  const imageData = location.state?.imageData; // ✅ 받은 데이터의 이미지 요청 주소

  console.log('📸 받은 이미지 데이터:', imageData);

  useEffect(() => {
    if (!imageData) {
      console.error('❌ 이미지 데이터가 없습니다.');
      navigate('/error-page'); // ✅ 오류 발생 시 에러 페이지로 이동 (선택 사항)
      return;
    }

    // ✅ 8초 대기 후 `/camera-play-select`로 이동 (blob 변환 없이 원본 URL 전달)
    setTimeout(() => {
      navigate('/camera-play-select', {
        state: { imageUrl: imageData },
      });
    }, 8000);
  }, [imageData, navigate]);

  return (
    <div>
      <NavbarContainer>
        <BackPlaySelectButton />
      </NavbarContainer>
      <div className="CameraImageGenerateContainer">
        <ImgGenerateText />
        <LoadingCircle className="camera-loading-circle" />
        <ImgGenerateImage />
      </div>
    </div>
  );
}
