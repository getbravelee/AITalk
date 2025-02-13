import { motion } from 'framer-motion';
import './DetailPlaySelectText.css';

export default function DetailPlaySelectText() {
  const text = '🦊 어떤 놀이를 해볼까요? 🪇';

  return (
    <motion.div
      className="DetailPlaySelectText"
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.1,
            repeat: Infinity,
            repeatType: 'reverse',
            duration: 1.5,
          },
        },
      }}
    >
      {text.split('').map((char, index) =>
        char.match(/[\uD800-\uDFFF]/) ? (
          // 이모지는 애니메이션 없이 그대로 표시
          <span key={index} className="EmojiText">
            {char}
          </span>
        ) : (
          <motion.span
            key={index}
            variants={{
              hidden: { y: 0 },
              visible: { y: [-5, 5, -5] },
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
