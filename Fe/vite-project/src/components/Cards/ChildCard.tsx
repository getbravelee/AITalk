import ChildData from '../../pages/KidSelectPage';
import './ChildCard.css';
import { HStack, Card, Image, Box, Badge, Button } from '@chakra-ui/react';
import CameraDialog from '../Dialogs/CameraDialog';

interface ChildCardProps {
  data: typeof ChildData;
}

export default function ChildCard({ data }: ChildCardProps): JSX.Element {
  return (
    <div className="ChildCard">
      <Card.Root flexDirection="row" overflow="hidden" maxW="xl">
        <Image
          src={data.profileImage || 'default-image.png'}
          alt={data.name}
          className="card-image"
          backgroundColor='lightgrey'
        />
        <Box>
          <Card.Body backgroundColor="lightgrey">
            <Card.Title mb="2">이름: {data.name}</Card.Title>
            <Card.Description>
              <h3>{data.name}</h3>
              <p>나이: {data.age}</p>
              <p>센터: {data.center}</p>
            </Card.Description>
            <HStack mt="4">
              {data.characteristic.map((character, index) => (
                <Badge>{character}</Badge>
              ))}
            </HStack>
          </Card.Body>
          <Card.Footer backgroundColor="lightgrey">
            <Button backgroundColor='lightblue' color='black'>선택하기</Button>
            <CameraDialog title='아이 얼굴 등록' message='카메라를 인식합니다.'/>
          </Card.Footer>
        </Box>
      </Card.Root>
    </div>
  );
}
