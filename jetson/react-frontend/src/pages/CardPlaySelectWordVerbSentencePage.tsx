import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

import NavbarContainer from '../components/Common/NavbarContainer';
import BackPlaySelectButton from '../components/Common/BackPlaySelectButton';
import CardInfoContainer from '../components/Common/CardInfoContainer';

import './CardPlaySelectWordVerbPage.css';
import './CardPlaySelectWordVerbSentencePage.css';

// ✅ 받침이 있는지 확인하는 함수
const hasFinalConsonant = (word: string): boolean => {
  if (!word) return false;

  const lastChar = word[word.length - 1];
  const lastCharCode = lastChar.charCodeAt(0);

  if (lastCharCode < 0xac00 || lastCharCode > 0xd7a3) return false;

  const finalConsonantIndex = (lastCharCode - 0xac00) % 28;
  return finalConsonantIndex !== 0;
};

export default function CardPlaySelectWordVerbSentencePage() {
  const location = useLocation();

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

  const combinedImageSrc = `/images/card/${secondCard.image}${firstCard[0].image}.png`;
  const particle = hasFinalConsonant(firstCard[0].name) ? '을' : '를';
  const combinedCardName = `${firstCard[0].name}${particle} ${secondCard.name}`;

  return (
    <div>
      <NavbarContainer>
        <BackPlaySelectButton className="CustomMarginTop" />
      </NavbarContainer>
      <div className="CardPlaySelectWordVerbSentenceContainer">
        {/* ✅ 등장은 기존처럼 유지, 이후 자연스럽게 움직이도록 설정 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotate: 50 }} // 처음엔 작고 회전
          animate={{
            opacity: 1,
            scale: [0, 1], // 점점 커짐
            rotate: 0, // 회전 정위치
          }}
          transition={{ duration: 2, ease: 'easeOut' }}
        >
          {/* ✅ 등장이 끝난 후에는 계속 부드럽게 떠다니는 효과 */}
          <motion.div
            animate={{
              y: [0, -5, 0, 5, 0], // 위아래로 둥둥 떠다님
              rotate: [-1, 1, -1], // 살짝 흔들리기
            }}
            transition={{
              duration: 3,
              delay: 3,
              ease: 'easeInOut',
              repeat: Infinity, // 무한 반복
              repeatType: 'reverse',
            }}
          >
            <CardInfoContainer
              className="LargeCardInfoContainer"
              imageSrc={combinedImageSrc}
              cardName={combinedCardName}
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
