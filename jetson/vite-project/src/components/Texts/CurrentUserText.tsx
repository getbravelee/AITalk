import { Text, HStack, Box } from '@chakra-ui/react';
import { RootState } from '../../feature/store';
import { useSelector } from 'react-redux';
import './TextFontFromGoogle.css';

export default function CurrentUserText() {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const currentChild = useSelector(
    (state: RootState) => state.child.currentChild,
  );
  return (
    <div>
      <Text fontSize={50} color="ivory" className="font">
        <HStack>
          안녕하세요 <Text color="#FFC100">{currentUser?.therapist_name}</Text>
          님!
          {currentChild && (
            <Text>
              <HStack pl="15px">
                안녕 <Text color="#FFC100">{currentChild?.child_name}</Text>아!
              </HStack>
            </Text>
          )}
        </HStack>
      </Text>
    </div>
  );
}
