import { ChildData } from '../../utils/ChunkArray';
import {
  HStack,
  Card,
  Image,
  Box,
  Badge,
  Text,
  Button,
  Flex,
  VStack,
} from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { setChildId } from '../../feature/child/childSlice';
import { usePlayStart } from '../../hooks/UsePlayStart';
import UseFaceRegistration from '../../hooks/UseFaceRegistration';
import { RootState } from '../../feature/store';
import {
  FaceIdAnimationLoadingForKid,
  FaceIdAnimationCheckForKid,
} from '../FaceID/FaceIdAnimationLoading';

interface ChildCardProps {
  data: ChildData;
}

export default function ChildCard({ data }: ChildCardProps): JSX.Element {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const { isRegisting, isCompleted, registerFace } = UseFaceRegistration();
  const playStart = usePlayStart();
  const faceIdImage: string = 'images/login/FaceID.svg';
  const childDefaultImage = 'images/childDummyImage/child_default.png';
  const handleRegisterClick = () => {
    registerFace(
      currentUser?.therapist_id,
      currentUser?.therapist_name,
      'k',
      data.child_id,
      data.child_name,
    );
  };
  const dispatch = useDispatch();
  return (
    <div>
      <Card.Root
        flexDirection="row"
        overflow="hidden"
        // size='lg'
        width="400px" // 전체 카드의 너비를 작게 지정
        height="200px"
        borderRadius="3xl"
        boxShadow="md"
        onClick={async () => {
          // Card.Root를 클릭하면 child_id를 전역 state (redux persist 포함)에 저장
          // 이후 치료가 완료되면 해당 child의 치료 정보를 서버에 전달할 수 있도록 함.
          dispatch(setChildId(data));
          try {
            // 아이의 카드를 누르면 play-select 페이지로 이동
            await playStart({
              therapist_id: currentUser?.therapist_id,
              child_id: data.child_id,
            });
          } catch (error) {
            console.error('플레이 시작 요청 실패:', error);
          }
        }}
      >
        <Image
          src={data.profile_image || childDefaultImage}
          alt={data.child_name}
          className="card-image"
          backgroundColor="lightgrey"
          boxSize="200px" // 이미지 크기를 작게 설정
          objectFit="cover"
        />
        <Card.Body backgroundColor="#FF9A6C" height={'400px'} color="#FFFDD0">
          <VStack gap={-1}>
            <Card.Title fontSize={60}>이름: {data.child_name}</Card.Title>
            <Card.Description>
              <Text fontSize={60} color="#FFFDD0">
                나이 : {data.age}
              </Text>
            </Card.Description>
            <HStack onClick={(e) => e.stopPropagation()}>
              <Badge
                fontSize={25}
                height="50px"
                rounded="3xl"
                backgroundColor="#FFD3B8"
                color="#333333"
              >
                {data.disability_type}
              </Badge>
              {isRegisting ? (
                // 인증 진행 중에는 로딩 애니메이션(faceid_animation_1)을 보여줌
                <Flex direction="column" align="center">
                  <FaceIdAnimationLoadingForKid />
                </Flex>
              ) : isCompleted ? (
                // 인증 완료 후에는 체크 애니메이션(faceid_animation_2)을 보여줌
                <Flex direction="column" align="center">
                  <FaceIdAnimationCheckForKid />
                </Flex>
              ) : (
                // 초기 상태 - 인증 시작 전 UI
                <Button
                  backgroundColor="transparent"
                  onClick={handleRegisterClick}
                >
                  <img src={faceIdImage} alt="FaceID" width="50px" />
                </Button>
              )}
            </HStack>
          </VStack>
        </Card.Body>
      </Card.Root>
    </div>
  );
}
