import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import NavbarContainer from '../components/Common/NavbarContainer';
import BackPlaySelectButton from '../components/Common/BackPlaySelectButton';
import DetailPlaySelectText from '../components/Texts/DetailPlaySelectText';
import CardInfoContainer from '../components/Common/CardInfoContainer';
import WordButton from '../components/Common/WordButton';
import ThreeSentenceButton from '../components/Common/ThreeSentenceButton';
import { useSelector } from 'react-redux';
import { RootState } from '../feature/store';

import './CardPlaySelectPage.css';

export default function CardPlaySelectPage() {
  const location = useLocation();
  const cardData = location.state || { name: 'Unknown', image: 'default' };
  const currentScheduleId: number | null = useSelector((state: RootState) =>
    state.treatment?.treatmentId
      ? Number(state.treatment?.treatmentId) // 🔥 string을 number로 변환
      : null,
  );
  // 데이터가 배열이라면 첫 번째 요소 사용
  const parsedCardData = Array.isArray(cardData) ? cardData[0] : cardData;

  // 이미지 경로 설정
  const imageSrc = `/images/card/${parsedCardData.image}.png`;

  return (
    <div>
      <NavbarContainer>
        <BackPlaySelectButton className="CustomMarginTop" />
      </NavbarContainer>
      <div className="CardPlaySelectContainer">
        <DetailPlaySelectText />
        <div className="CardPlaySelectInnerContainer">
          {/* 1️⃣ "펑!" 애니메이션 (처음 한 번만 실행) */}
          <motion.div
            animate={{ scale: [0, 1.2, 1], opacity: 1 }} // 펑! 하고 커짐
            transition={{ duration: 2, ease: 'easeOut' }}
          >
            {/* 2️⃣ 둥둥 떠다니는 애니메이션 (펑! 이후 실행) */}
            <motion.div
              animate={{
                y: [0, -5, 0, 5, 0], // 위아래 둥둥 떠다니기
                rotate: [0, 1, -1, 0], // 살짝 흔들리기
              }}
              transition={{
                duration: 5,
                ease: 'easeInOut',
                repeat: Infinity, // 무한 반복
                repeatType: 'reverse',
              }}
            >
              <CardInfoContainer
                className="CardPlaySelectInfoContainer"
                imageSrc={imageSrc}
                cardName={parsedCardData.name}
              />
            </motion.div>
          </motion.div>

          <div className="ButtonsContainers">
            <WordButton
              className="CardPlaySelectWordButtonStyle"
              targetPath="/card-play-select/word"
            />
            <ThreeSentenceButton
              className="CardPlaySelectThreeSentenceButtonStyle"
              schedule_id={currentScheduleId ?? 0}
              word={parsedCardData.image}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
