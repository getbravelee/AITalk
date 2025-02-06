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

interface ChildCardProps {
  data: typeof ChildData;
}

export default function ChildCard({ data }: ChildCardProps): JSX.Element {
  const childDefaultImage = 'src/assets/ChildDummyImage/child_default.png';
  const navigate = useNavigate()
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
          alert(
            '해당 아이의 id를 넘겨 이후의 치료 과정동안 식별가능해야 함',
          );
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
            <Card.Title fontSize={10}>이름: {data.child_name}</Card.Title>
            <Card.Description fontSize="xs">
              <Text fontSize={10}>나이 : {data.age}</Text>
              <Text fontSize={10}>치료사ID : {data.therapist_id}</Text>
            </Card.Description>
            <HStack onClick={(e) => e.stopPropagation()}>
              <Badge fontSize={5}>{data.disability_type}</Badge>
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
