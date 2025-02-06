import ChildData from '../../pages/KidSelectPage';
import './ChildCard.css';
import { HStack, Card, Image, Box, Badge, Button, Text } from '@chakra-ui/react';
import CameraDialog from '../Dialogs/CameraDialog';

interface ChildCardProps {
  data: typeof ChildData;
}

export default function ChildCard({ data }: ChildCardProps): JSX.Element {
  const childDefaultImage = 'src/assets/ChildDummyImage/child_default.png'
  return (
    <div className="ChildCard">
      <Card.Root flexDirection="row" overflow="hidden" maxW="xl">
        <Image
          src={data.profile_image || childDefaultImage }
          alt={data.child_name}
          className="card-image"
          backgroundColor='lightgrey'
        />
        <Box>
          <Card.Body backgroundColor="lightgrey">
            <Card.Title mb="2">이름: {data.child_name}</Card.Title>
            <Card.Description>
              <h3>{data.child_name}</h3>
              {/* <Text>{data.child_name}</Text> */}
              <p>나이 : {data.age}</p>
              <p>치료사ID : {data.therapist_id}</p>
            </Card.Description>
            <HStack mt="4">
                <Badge>{data.disability_type}</Badge>
            </HStack>
          </Card.Body>
          <Card.Footer backgroundColor="lightgrey">
            <Button backgroundColor='lightblue' color='black' onClick={() => (
              alert(`${data.child_name}이의 치료를 시작합니다`)
            )}>선택하기</Button>
            <CameraDialog title='아이 얼굴 등록' message='카메라를 인식합니다.'/>
          </Card.Footer>
        </Box>
      </Card.Root>
    </div>
  );
}
