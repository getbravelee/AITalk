import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import NavbarContainer from '../components/Common/NavbarContainer';
import BackPlaySelectButton from '../components/Common/BackPlaySelectButton';
import DetailPlaySelectText from '../components/Texts/DetailPlaySelectText';
import CategoryCardInfoContainer from '../components/Common/CategoryCardInfoContainer';
import WordButton from '../components/Common/WordButton';
import ThreeSentenceButton from '../components/Common/ThreeSentenceButton';
import { useSelector } from 'react-redux';
import { RootState } from '../feature/store';
import './CategoryCardPlaySelectPage.css';

export default function CategoryCardPlaySelectPage() {
  const location = useLocation();
  const cardData = location.state || { name: 'Unknown', image: 'default' };
  const currentScheduleId: number | null = useSelector((state: RootState) =>
    state.treatment?.treatmentId
      ? Number(state.treatment?.treatmentId) // 🔥 string을 number로 변환
      : null,
  );
  // 데이터가 배열이라면 첫 번째 요소 사용
  const parsedCardData = Array.isArray(cardData) ? cardData[0] : cardData;

  return (
    <div>
      <NavbarContainer>
        <BackPlaySelectButton className="CustomMarginTop" />
      </NavbarContainer>
      <div className="CategoryCardPlaySelectContainer">
        <DetailPlaySelectText />
        <div className="CategoryCardPlaySelectInnerContainer">
          {/* 1️⃣ "펑!" 애니메이션 (처음 한 번만 실행) */}
          <motion.div
            animate={{ scale: [0, 1.2, 1], opacity: 1 }}
            transition={{ duration: 2, ease: 'easeOut' }}
          >
            {/* 2️⃣ 둥둥 떠다니는 애니메이션 (펑! 이후 실행) */}
            <motion.div
              animate={{
                y: [0, -5, 0, 5, 0],
                rotate: [0, 1, -1, 0],
              }}
              transition={{
                duration: 5,
                ease: 'easeInOut',
                repeat: Infinity,
                repeatType: 'reverse',
              }}
            >
              {/* ✅ 카테고리 카드 전용 컨테이너 */}
              <CategoryCardInfoContainer
                category={parsedCardData.image}
                categories={parsedCardData.categories}
              />
            </motion.div>
          </motion.div>

          {/* ✅ 카드 이름 추가 */}
          <p className="CategoryCardTitle">{parsedCardData.name}</p>

          <div className="ButtonContainers">
            <WordButton
              className="CategoryCardPlaySelectWordButtonStyle"
              targetPath="/card-play-select/word"
            />
            <ThreeSentenceButton
              className="CategoryCardPlaySelectThreeSentenceButtonStyle"
              targetPath="/card-play-select/three-sentence"
              schedule_id={currentScheduleId ?? 0}
              word={parsedCardData.image}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
