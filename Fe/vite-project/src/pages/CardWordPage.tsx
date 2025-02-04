import Images from '../components/Images/DetailImages';
import MainText from '../components/Texts/MainText';

export default function CardWordPage() {
  return (
    <div>
      <Images width={300} height={700} />
      <MainText message="카드: 담다" />
    </div>
  );
}
