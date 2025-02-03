import Images from '../components/DetailImages';
import MainText from '../components/MainText';

export default function CardWordPage() {
  return (
    <div>
      <Images width={300} height={700} />
      <MainText message="카드: 담다" />
    </div> 
  );
}
