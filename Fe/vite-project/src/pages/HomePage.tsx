import { useEffect } from 'react';
import { useAudio } from '../components/Common/AudioContext';
import { useNavigate } from 'react-router-dom';
import { Button, HStack } from '@chakra-ui/react';
import CardTagButtonForFaceResist from '../components/Buttons/CardTagButtonForFaceResist';
import CardTagButtonForLogin from '../components/Buttons/CardTagButtonForLogin';
import HomeText from '../components/Texts/HomeText';
import './HomePage.css';
import './CardPlaySelectWordPage.css';

export default function HomePage() {
  const { setAudioType, isPlaying, toggleAudio } = useAudio(); // 🎵 오디오 상태 & 토글 함수 가져오기
  const navigate = useNavigate();

  useEffect(() => {
    setAudioType('home'); // HomePage에 오면 'homepagemusic.mp3' 재생
  }, []);

  return (
    <div className="HomeContainer">
      {/* 🎵 배경음악 토글 버튼 */}
      <button className="MusicToggleButton" onClick={toggleAudio}>
        {isPlaying ? '🔇 음악 끄기' : '🔊 음악 켜기'}
      </button>

      <HomeText />
      <div className="ButtonsContainer">
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
