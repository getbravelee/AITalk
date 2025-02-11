import ChildData from '../../pages/KidSelectPage';
import {
  HStack,
  Card,
  Image,
  Box,
  Badge,
  Text,
} from '@chakra-ui/react';
import ResistCameraDialog from '../Dialogs/ResistCameraDialog';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setChildId } from '../../feature/child/childSlice'

interface ChildCardProps {
  data: typeof ChildData;
}

export default function ChildCard({ data }: ChildCardProps): JSX.Element {
  const childDefaultImage = 'src/assets/ChildDummyImage/child_default.png';
  const navigate = useNavigate()
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
        onClick={() => {
          // Card.Root를 클릭하면 child_id를 전역 state (redux persist 포함)에 저장
          // 이후 치료가 완료되면 해당 child의 치료 정보를 서버에 전달할 수 있도록 함.
          dispatch(setChildId(child_id));
          alert(`${child_name}의 치료를 시작합니다!`)
          navigate("/play-select")
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
          <Card.Body
            backgroundColor="lightgrey"
            height={'120px'}
          >
            <Card.Title fontSize={20}>이름: {data.child_name}</Card.Title>
            <Card.Description fontSize="xs">
              <Text fontSize={15}>나이 : {data.age}</Text>
              {/* <Text fontSize={15}>센터명 : {data.center_name}</Text> */}
            </Card.Description>
            <HStack onClick={(e) => e.stopPropagation()}>
              <Badge fontSize={10}>{data.disability_type}</Badge>
              <ResistCameraDialog
                title="아이 얼굴 등록"
                message="카메라를 인식합니다."
                isSmall={true}
              />
            </HStack>
          </Card.Body>
        </Box>
      </Card.Root>
    </div>
  );
}
