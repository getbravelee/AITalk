import ChildData from '../../pages/KidSelectPage';
import {
  HStack,
  Card,
  Image,
  Box,
  Badge,
  Text,
  Button,
} from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { setChildId } from '../../feature/child/childSlice';
import { usePlayStart } from '../../hooks/UsePlayStart';
import UseFaceRegistration from '../../hooks/UseFaceRegistration';
import { RootState } from '../../feature/store';

interface ChildCardProps {
  data: typeof ChildData;
}

export default function ChildCard({ data }: ChildCardProps): JSX.Element {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const playStart = usePlayStart();
  const faceIdImageSmall: string = 'src/assets/Login/FaceID_small.svg';
  const childDefaultImage = 'src/assets/ChildDummyImage/child_default.png';
  // const navigate = useNavigate();
  const { registerFace } = UseFaceRegistration({
    therapist_id: currentUser.therapist_id,
    therapist_name: currentUser.therapist_name,
  });
  const handleRegisterClick = () => {
    registerFace(
      currentUser.therapist_id,
      currentUser.therapist_name,
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
        size="sm"
        width="250px" // 전체 카드의 너비를 작게 지정
        borderRadius="md"
        boxShadow="md"
        onClick={async () => {
          // Card.Root를 클릭하면 child_id를 전역 state (redux persist 포함)에 저장
          // 이후 치료가 완료되면 해당 child의 치료 정보를 서버에 전달할 수 있도록 함.
          dispatch(setChildId(data.child_id));
          alert(
            `${currentUser.therapist_name}님! ${data.child_name}의 치료를 시작합니다!`,
          );
          // alert 닫기 버튼을 누르면 currentUser.therapist_id 와 data.child_id를
          // /play-start 주소로 api 요청 해야함
          try {
            await playStart({
              therapistId: currentUser.therapist_id,
              childId: data.child_id,
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
          boxSize="120px" // 이미지 크기를 작게 설정
          objectFit="cover"
        />
        <Box width="100%">
          <Card.Body backgroundColor="lightgrey" height={'120px'}>
            <Card.Title fontSize={20}>이름: {data.child_name}</Card.Title>
            <Card.Description fontSize="xs">
              <Text fontSize={15}>나이 : {data.age}</Text>
            </Card.Description>
            <HStack onClick={(e) => e.stopPropagation()}>
              <Badge fontSize={10}>{data.disability_type}</Badge>
              <Button
                backgroundColor="transparent"
                onClick={handleRegisterClick}
              >
                <img src={faceIdImageSmall} alt="FaceID" />
              </Button>
            </HStack>
          </Card.Body>
        </Box>
      </Card.Root>
    </div>
  );
}
