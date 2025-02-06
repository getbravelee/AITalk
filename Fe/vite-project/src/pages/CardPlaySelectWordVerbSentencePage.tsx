import { useLocation } from 'react-router-dom';

import NavbarContainer from '../components/Common/NavbarContainer';
import BackButton from '../components/Common/BackButton';
import CardInfoContainer from '../components/Common/CardInfoContainer';

import './CardPlaySelectWordVerbPage.css';
import './CardPlaySelectWordVerbSentencePage.css';

// ✅ 받침이 있는지 확인하는 함수
const hasFinalConsonant = (word: string): boolean => {
  if (!word) return false;

  const lastChar = word[word.length - 1]; // ✅ 마지막 글자 가져오기
  const lastCharCode = lastChar.charCodeAt(0); // ✅ 유니코드 변환

  // ✅ 한글 범위 내에 있는지 확인 (가~힣: 0xAC00 ~ 0xD7A3)
  if (lastCharCode < 0xac00 || lastCharCode > 0xd7a3) return false;

  const finalConsonantIndex = (lastCharCode - 0xac00) % 28; // ✅ 받침 확인
  return finalConsonantIndex !== 0; // 받침이 있으면 true, 없으면 false
};

export default function CardPlaySelectWordVerbSentencePage() {
  const location = useLocation();

  // ✅ `firstCard`와 `secondCard` 데이터를 받아옴
  const firstCard = location.state?.firstCard || {
    name: 'Unknown',
    image: 'default',
  };
  const secondCard = location.state?.secondCard || {
    name: 'Unknown',
    image: 'default',
  };

  console.log('🔍 First NFC Card:', firstCard);
  console.log('🔍 Second NFC Card:', secondCard);

  // ✅ `secondCard.image + firstCard.image + ".png"` 형식으로 이미지 파일 경로 설정
  const combinedImageSrc = `/src/assets/card/${secondCard.image}${firstCard.image}.png`;

  // ✅ `을` 또는 `를`을 추가하여 문장 만들기
  const particle = hasFinalConsonant(firstCard.name) ? '을' : '를'; // 받침 여부에 따라 조사 선택
  const combinedCardName = `${firstCard.name}${particle} ${secondCard.name}`; // ✅ "빵을 먹다" 형태

  return (
    <div>
      <NavbarContainer>
        <BackButton />
      </NavbarContainer>
      <div className="CardPlaySelectWordVerbSentenceContainer">
        <CardInfoContainer
          className="LargeCardInfoContainer"
          imageSrc={combinedImageSrc}
          cardName={combinedCardName} // ✅ "빵을 먹다" 형태 전달
        />
      </div>
    </div>
  );
}
