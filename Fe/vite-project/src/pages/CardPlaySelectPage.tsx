import NavbarContainer from '../components/Common/NavbarContainer';
import BackButton from '../components/Common/BackButton';

import DetailPlaySelectText from '../components/Texts/CardPlaySelectText';
import CardInfoContainer from '../components/Common/CardInfoContainer';
import WordButton from '../components/Common/WordButton';
import ThreeSentenceButton from '../components/Common/ThreeSentenceButton';

import './CardPlaySelectPage.css';

export default function CardPlaySelectPage() {
  return (
    <div>
      <NavbarContainer>
        <BackButton />
      </NavbarContainer>
      <div className="CardPlaySelectContainer">
        <DetailPlaySelectText />
        <div className="CardPlaySelectInnerContainer">
          <div className="CardContainer">
            <CardInfoContainer imageSrc="/src/assets/card/bread.png" />
          </div>
          <div className="ButtonContainer">
            <WordButton />
            <ThreeSentenceButton />
          </div>
        </div>
      </div>
    </div>
  );
}
