import { motion } from 'framer-motion';

import NavbarContainer from '../components/Common/NavbarContainer';
import BackPlaySelectButton from '../components/Common/BackPlaySelectButton';
import CardInfoContainer from '../components/Common/CardInfoContainer';

import './CameraPlaySelectThreeSentencePage.css';

export default function CameraPlaySelectThreeSentencePage() {
  return (
    <div>
      <NavbarContainer>
        <BackPlaySelectButton />
      </NavbarContainer>
      <div className="CameraPlaySelectThreeSentenceContainer">
        {/* ✅ 등장은 기존처럼 유지, 이후 자연스럽게 움직이도록 설정 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotate: 50 }} // 처음엔 작고 회전
          animate={{
            opacity: 1,
            scale: [0, 1], // 점점 커짐
            rotate: 0, // 회전 정위치
          }}
          transition={{ duration: 4, ease: 'easeOut' }}
        >
          {/* ✅ 등장이 끝난 후에는 계속 부드럽게 떠다니는 효과 */}
          <motion.div
            animate={{
              y: [0, -5, 0, 5, 0], // 위아래로 둥둥 떠다님
              rotate: [-1, 1, -1], // 살짝 흔들리기
            }}
            transition={{
              duration: 3,
              delay: 5,
              ease: 'easeInOut',
              repeat: Infinity, // 무한 반복
              repeatType: 'reverse',
            }}
          >
            <CardInfoContainer
              className="LargeCardInfoContainer"
              imageSrc={'3어문 이미지 들어갈 곳'}
              cardName={'3어문 텍스트 들어갈 곳'}
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
