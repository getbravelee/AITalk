import './Title.css';
import { useNavigate } from 'react-router-dom';
import { Text } from '@chakra-ui/react';

export default function MainTitle() {
  const navigate = useNavigate();

  const handleClick = (): void => {
    navigate('TherapistFaceLoginPage');
  };
  return (
    <div className="title">
      <Text fontSize="2xl" onClick={handleClick}>
        아이톡
      </Text>
      <Text fontSize="2xl">(Ai Talk)</Text>
      <Text fontSize="lg">놀이로 배우는 재밌는 언어치료</Text>
    </div>
  );
}
