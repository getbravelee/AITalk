import React from 'react';
import NavbarContainer from '../components/Common/NavbarContainer';
import BackButton from '../components/Common/BackButton';
import CameraBox from '../components/Camera/CameraBox';
import { UseScaleFactor } from '../utils/UseScaleFactor';
import { Box } from '@chakra-ui/react';

const CameraPlayPage: React.FC = () => {
  const scaleFactor = UseScaleFactor(1.4); // 커스텀 확대 배율

  return (
    <div className="BackgroundContainer">
      <NavbarContainer>
        <BackButton />
      </NavbarContainer>
      <Box height={5} />
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 'calc(100vh - 60px)', // 네비게이션 영역 제외
        }}
      >
        <CameraBox scaleFactor={scaleFactor} />
      </div>
    </div>
  );
};

export default CameraPlayPage;
