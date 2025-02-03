import '../styles/Home.css';
import Title from '../components/MainTitle';
import { Button } from '@chakra-ui/react';

export default function Home() {
  return (
    <div className="home">
      <Title />
      <Button
        colorScheme="blue"
        onClick={() => {
          alert('wow?');
        }}
      >
        Click me
      </Button>
    </div>
  );
}
