import { motion } from 'framer-motion';
import './PlaySelectText.css';

export default function PlaySelectText() {
  const text = '🐻 오늘은 무엇을 하고 놀까요? 🎈';

  return (
    <motion.div
      className="PlaySelectText"
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.1, // ✅ 글자마다 0.1초 간격으로 실행
            repeat: Infinity, // ✅ 무한 반복
            repeatType: 'reverse',
            duration: 1.5, // 전체 애니메이션 지속 시간
          },
        },
      }}
    >
      {text.split('').map((char, index) =>
        char.match(/[\uD800-\uDFFF]/) ? (
          // ✅ 이모지는 애니메이션 없이 그대로 표시
          <span key={index} className="EmojiText">
            {char}
          </span>
        ) : (
          <motion.span
            key={index}
            variants={{
              hidden: { y: 0 },
              visible: { y: [-5, 5, -5] }, // ✅ 위로 올라갔다가 다시 내려옴
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="WaveText"
          >
            {char}
          </motion.span>
        ),
      )}
    </motion.div>
  );
}
