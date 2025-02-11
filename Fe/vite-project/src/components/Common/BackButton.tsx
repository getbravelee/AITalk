import { useNavigate, useLocation } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5'; // 뒤로가기 화살표 아이콘
import { HStack } from '@chakra-ui/react';
import './BackButton.css';
import CurrentUserText from '../Texts/CurrentUserText';
import LogoutButton from '../Buttons/LogoutButton';
import { RootState } from '../../feature/store';
import { useSelector } from 'react-redux';
import HomeButton from './HomeButton';

export default function BackButton() {
  const navigate = useNavigate();
  const location = useLocation(); // 📍 현재 위치 정보 가져오기
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const handleBack = () => {
    if (location.pathname === '/play-select') {
      navigate('/ '); // ✅ PlaySelectPage에서는 HomePage('/')로 이동
    } else {
      navigate(-1); // ✅ 다른 경우 기본적으로 -1로 이동
    }
  };

  return (
    <HStack gap={423} pt={1}>
      <button onClick={handleBack} className="BackButton">
        <IoArrowBack className="BackIcon" />
      </button>
      {/* 로그인 한 경우에만 치료사의 이름이 렌더링되도록 함함 */}
      {currentUser && (
        <HStack>
          <CurrentUserText />
          <LogoutButton />
          <HomeButton />
        </HStack>
      )}
    </HStack>
  );
}
