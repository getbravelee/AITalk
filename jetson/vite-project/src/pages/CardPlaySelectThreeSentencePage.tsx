import NavbarContainer from '../components/Common/NavbarContainer';
import BackPlaySelectButton from '../components/Common/BackPlaySelectButton';
import CardInfoContainer from '../components/Common/CardInfoContainer';

import './CardPlaySelectThreeSentencePage.css';

export default function CardPlaySelectThreeSentencePage() {
  return (
    <div>
      <NavbarContainer>
        <BackPlaySelectButton />
      </NavbarContainer>
      <div className="CardPlaySelectThreeSentenceContainer">
        <CardInfoContainer
          className="LargeCardInfoContainer"
          imageSrc={'3어문 이미지 들어갈 곳'}
          cardName={'3어문 텍스트 들어갈 곳'}
        />
      </div>
    </div>
  );
}
