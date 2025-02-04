import MainText from '../components/Texts/MainText';
import Images from '../components/Images/DetailImages';
import MoveButton from '../components/Buttons/MoveButton';
import Navbar from '../components/Common/BackButton';

export default function DetailSelect() {
  return (
    <div className="detailselect">
      <Navbar />
      <MainText message="오늘은 무엇을 하고 놀아볼까요??" />
      <Images width={300} height={700} />
      <MoveButton message="단어 페이지로 이동합니다." page="CardWordPage">
        단어
      </MoveButton>
      <MoveButton message="단어 페이지로 이동합니다." page="CardThreeWordPage">
        3어문
      </MoveButton>
    </div>
  );
}
