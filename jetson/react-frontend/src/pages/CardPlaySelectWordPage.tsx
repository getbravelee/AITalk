import { useLocation } from 'react-router-dom';

import NavbarContainer from '../components/Common/NavbarContainer';
import BackPlaySelectButton from '../components/Common/BackPlaySelectButton';
import CardInfoContainer from '../components/Common/CardInfoContainer';
import CateCardInfoContainer from '../components/Common/CateCardInfoContainer';
import NfcImage from '../components/Images/NfcImage';
import LoadingCircle from '../components/Common/LoadingCircle';
import NfcTagText from '../components/Texts/NfcTagText';

import './CardPlaySelectWordPage.css';

export default function CardPlaySelectWordPage() {
  const location = useLocation();

  // NFC 태그 정보를 받아옴
  const firstCard = location.state?.firstCard || {
    name: 'Unknown',
    image: 'default',
    categories: [] as string[], // ✅ categories의 타입을 명시적으로 string[]으로 지정
    card_id: 0, // 기본값
  };
  const secondCard = location.state?.secondCard || {
    name: 'Unknown',
    image: 'default',
  };

  console.log('🔍 First NFC Card:', firstCard);
  console.log('🔍 Second NFC Card:', secondCard);

  return (
    <div>
      <NavbarContainer>
        <BackPlaySelectButton className="CustomMarginTop" />
      </NavbarContainer>
      <div className="CardPlaySelectWordContainer">
        <div className="NfcLoadingsWrapper">
          <NfcImage className="SmallNfcCentered" />
          <LoadingCircle className="LoadingCentered" />
          <NfcTagText className="SmallNfcTagText" />
        </div>

        <div className="BigCardInfoContainer">
          {firstCard[0].card_id >= 3000 && firstCard[0].card_id <= 3999 ? (
            // ✅ 3000~3999번 카드: 기존 방식
            <CardInfoContainer
              imageSrc={`/images/card/${firstCard[0].image}.png`}
              cardName={firstCard[0].name}
            />
          ) : (
            // ✅ 1000~1999번 카드: 새로운 CateCardInfoContainer 사용
            <div className="CategoryImagesContainer">
              <div className="CategoryImagesGrid">
                {firstCard[0].categories?.map((category: string) => (
                  <CateCardInfoContainer
                    key={category}
                    imageSrc={`/images/card/${firstCard[0].image}/${category}.png`}
                  />
                ))}
              </div>
              {/* ✅ 이미지 아래에 단어 추가 */}
              <p className="CategoryCardName">{firstCard[0].name}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
