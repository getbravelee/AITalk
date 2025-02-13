import { motion } from 'framer-motion';
import NavbarContainer from '../components/Common/NavbarContainer';
import BackPlaySelectButton from '../components/Common/BackPlaySelectButton';
import DetailPlaySelectText from '../components/Texts/DetailPlaySelectText';
import CardInfoContainer from '../components/Common/CardInfoContainer';
import WordButton from '../components/Common/WordButton';
import ThreeSentenceButton from '../components/Common/ThreeSentenceButton';

import './CameraPlaySelectPage.css';

export default function CameraPlaySelectPage() {
  const imageSrc = '/src/assets/card/bread.png';
  const cardName = '빵';

  return (
    <div>
      <NavbarContainer>
        <BackPlaySelectButton />
      </NavbarContainer>
      <div className="CameraPlaySelectContainer">
        <DetailPlaySelectText />
        <div className="CameraPlaySelectInnerContainer">
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
              {/* 카메라로 찍은 물건으로 생성형 AI가 만들어낸 이미지 정보 올 것임 현재는 그냥 위에 빵으로 선언 해놓음*/}
              <CardInfoContainer imageSrc={imageSrc} cardName={cardName} />
            </motion.div>
          </motion.div>

          <div className="ButtonContainer">
            {/* CameraPlaySelectPage 전용 경로 설정 */}
            <WordButton targetPath="/camera-play-select/word" />
            <ThreeSentenceButton targetPath="/camera-play-select/three-sentence" />
          </div>
        </div>
      </div>
    </div>
  );
}
