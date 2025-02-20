import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import NavbarContainer from '../components/Common/NavbarContainer';
import BackPlaySelectButton from '../components/Common/BackPlaySelectButton';
import DetailPlaySelectText from '../components/Texts/DetailPlaySelectText';
import CardInfoContainer from '../components/Common/CardInfoContainer';
import ThreeSentenceButton from '../components/Common/ThreeSentenceButton';

import './CameraPlaySelectPage.css';

export default function CameraPlaySelectPage() {
  const location = useLocation();
  const imageSrc = location.state?.imageUrl;
  const data = location.state?.data;

  console.log('📸 사용될 이미지:', imageSrc); // ✅ 콘솔에서 확인

  return (
    <div>
      <NavbarContainer>
        <BackPlaySelectButton className="CustomMarginTop" />
      </NavbarContainer>
      <div className="CameraPlaySelectContainer">
        <DetailPlaySelectText />
        <div className="CameraPlaySelectInnerContainer">
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
              {/* ✅ 불러온 이미지 적용 */}
              <CardInfoContainer imageSrc={imageSrc.image} />
            </motion.div>
          </motion.div>

          <div className="ButtonContainer">
            <ThreeSentenceButton
              className="CameraPlaySelectThreeSentenceButtonStyle"
              schedule_id={data.schedule_id}
              word={data.word}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
