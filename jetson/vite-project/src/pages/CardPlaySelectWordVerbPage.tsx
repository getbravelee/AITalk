import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

import NavbarContainer from '../components/Common/NavbarContainer';
import BackPlaySelectButton from '../components/Common/BackPlaySelectButton';
import CardInfoContainer from '../components/Common/CardInfoContainer';
import CateCardInfoContainer from '../components/Common/CateCardInfoContainer';

import './CardPlaySelectWordVerbPage.css';

export default function CardPlaySelectWordVerbPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const firstCard = Array.isArray(location.state?.firstCard)
    ? location.state?.firstCard
    : [
        {
          name: 'Unknown',
          image: 'default',
          categories: [] as string[],
          card_id: 0,
        },
      ];
  const secondCard = location.state?.secondCard || {
    name: 'Unknown',
    image: 'default',
  };

  console.log('🔍 First NFC Card:', firstCard[0]);
  console.log('🔍 Second NFC Card:', secondCard);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/card-play-select/word/verb/sentence', {
        state: { firstCard, secondCard },
      });
    }, 6000);

    return () => clearTimeout(timer);
  }, [navigate, firstCard, secondCard]);

  return (
    <div>
      <NavbarContainer>
        <BackPlaySelectButton className="CustomMarginTop" />
      </NavbarContainer>

      <div className="CardPlaySelectWordVerbContainer">
        {/* ✅ 1000~1999번 카드일 경우 여러 개의 이미지 표시 + 이름 추가 */}
        {firstCard[0].card_id >= 1000 && firstCard[0].card_id <= 1999 ? (
          <div className="CategoryImagesWrapper">
            <motion.div
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 2, ease: 'easeOut' }}
              className="CategoryImagesGrids"
            >
              {firstCard[0].categories.map((category: string) => (
                <CateCardInfoContainer
                  key={category}
                  imageSrc={`/images/card/${firstCard[0].image}/${category}.png`}
                />
              ))}
            </motion.div>
            {/* ✅ 이미지 아래에 카드 이름 추가 */}
            <p className="CategoryCardTitles">{firstCard[0].name}</p>
          </div>
        ) : (
          // ✅ 기존 3000~3999번 카드 로직 유지
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 2, ease: 'easeOut' }}
          >
            <CardInfoContainer
              imageSrc={`/images/card/${firstCard[0].image}.png`}
              cardName={firstCard[0].name}
            />
          </motion.div>
        )}

        {/* "+" 기호 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 2 }}
          className="Plus"
        >
          <p>+</p>
        </motion.div>

        {/* ✅ 2번 카드 (secondCard) */}
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2, ease: 'easeOut', delay: 3.5 }}
        >
          <CardInfoContainer
            imageSrc={`/images/card/${secondCard.image}.png`}
            cardName={secondCard.name}
          />
        </motion.div>
      </div>
    </div>
  );
}
