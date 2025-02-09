import { Text } from '@chakra-ui/react';
import { RootState } from '../../feature/store';
import { useSelector } from 'react-redux';
import './TextFontFromGoogle.css';

export default function CurrentUserText() {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  return (
    <div>
      <Text fontSize={13} color="white" className="font">
        안녕하세요 {currentUser.therapist_name}님!
      </Text>
    </div>
  );
}
