import NavbarContainer from '../components/Common/NavbarContainer';
import BackButton from '../components/Common/BackButton';
import CardInfoContainer from '../components/Common/CardInfoContainer';

import './CardPlaySelectWordVerbPage.css';
import './CardPlaySelectWordVerbSentencePage.css';

export default function CardPlaySelectWordVerbPage() {
  return (
    <div>
      <NavbarContainer>
        <BackButton />
      </NavbarContainer>
      <div className="CardPlaySelectWordVerbSentenceContainer">
        <CardInfoContainer
          className="LargeCardInfoContainer"
          imageSrc="/src/assets/card/eatBread.png"
        />
      </div>
    </div>
  );
}
