import { useNavigate } from 'react-router-dom';
import { Button } from '@chakra-ui/react';

import HomeText from '../components/Texts/HomeText';

import './HomePage.css';

export default function HomePage() {
  const navigate = useNavigate();
  return (
    <div className="HomeContainer">
      <HomeText />
      <div className="ButtonsContainer">
        <Button
          className="FaceIdLoginButton"
          onClick={() => navigate('/TherapistFaceLoginPage')}
        >
          Face ID로 로그인 하기
        </Button>
        <Button
          className="FaceIdRegistrationButton"
          onClick={() => navigate('/TherapistFaceResisterPage')}
        >
          Face ID 등록하기
        </Button>
        <Button
          className="IdPwLoginButton"
          onClick={() => navigate('/TherapistLoginPage')}
        >
          ID,PW로 로그인 하기
        </Button>
      </div>
    </div>
  );
}
