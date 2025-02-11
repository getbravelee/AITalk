import { useNavigate } from 'react-router-dom';
import { Button, HStack } from '@chakra-ui/react';
import CardTagButtonForFaceResist from '../components/Buttons/CardTagButtonForFaceResist';
import CardTagButtonForLogin from '../components/Buttons/CardTagButtonForLogin';
import HomeText from '../components/Texts/HomeText';
import './HomePage.css';
import './CardPlaySelectWordPage.css';


export default function HomePage() {
  const navigate = useNavigate();
  return (
    <div className="HomeContainer">
      <HomeText />
      <div className="ButtonContainer">
        <HStack>
          <Button
            className="FaceIdLoginButton"
            onClick={() => navigate('/TherapistFaceLoginPage')}
          >
            Face ID로 로그인 하기
          </Button>
          <CardTagButtonForLogin />
        </HStack>
        <CardTagButtonForFaceResist />
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
