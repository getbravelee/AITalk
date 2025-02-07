import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5'; // 뒤로가기 화살표 아이콘
import { HStack } from '@chakra-ui/react';
import './BackButton.css';
import CurrentUserText from '../Texts/CurrentUserText';
import LogoutButton from '../Buttons/LogoutButton';
// 유저 로그인 상태를 확인하기 위한 import
import { RootState } from '../../feature/user/store';
import { useSelector } from 'react-redux';
import HomeButton from './HomeButton';
function BackButton() {
  const navigate = useNavigate();
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const handleBack = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  return (
    <HStack gap={423} pt={1}>
      <button onClick={handleBack} className='BackButton'>
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

export default BackButton;
