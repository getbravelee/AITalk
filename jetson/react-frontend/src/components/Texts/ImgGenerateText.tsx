import { motion } from 'framer-motion';
import './ImgGenerateText.css';

interface ImgGenerateTextProps {
  className?: string; // className을 받을 수 있도록 설정
}

export default function ImgGenerateText({
  className = '',
}: ImgGenerateTextProps) {
  const text = '🪄 톡톡이가 그림을 만들고 있어요';

  return (
    <motion.div
      className={`ImgGenerateTextContainer ${className}`.trim()} // ✅ 기존 CSS 유지
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
          // ✅ 이모지는 애니메이션 없이 스타일 유지
          <span key={index} className="ImgGenerateText EmojiText">
            {char}
          </span>
        ) : (
          <motion.span
            key={index}
            variants={{
              hidden: { y: 0 },
              visible: { y: [-5, 5, -5] },
            }}
            transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
            className="ImgGenerateText WaveText" // ✅ 기존 CSS 적용
          >
            {char}
          </motion.span>
        ),
      )}
    </motion.div>
  );
}
