import { Text, HStack, Button } from '@chakra-ui/react';
import { RootState } from '../../feature/store';
import { useSelector } from 'react-redux';
import './TextFontFromGoogle.css';
import { useNavigate } from 'react-router-dom';

export default function CurrentUserText() {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const currentChild = useSelector(
    (state: RootState) => state.child.currentChild,
  );
  const navigate = useNavigate();
  return (
    <div>
      <Text fontSize={50} color="ivory" className="font">
        <HStack>
          안녕하세요 <Text color="#FFC100">{currentUser?.therapist_name}</Text>
          님!
          {currentChild && (
            <Text>
              <HStack pl="15px">
                안녕{' '}
                <Button
                  color="#FFC100"
                  backgroundColor="transparent"
                  fontSize={50}
                  margin={-4.5}
                  onClick={() => navigate('/KidSelectPage')}
                >
                  {currentChild?.child_name}
                </Button>
                아!
              </HStack>
            </Text>
          )}
        </HStack>
      </Text>
    </div>
  );
}
