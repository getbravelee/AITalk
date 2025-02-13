import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

import NavbarContainer from '../components/Common/NavbarContainer';
import BackPlaySelectButton from '../components/Common/BackPlaySelectButton';
import CardInfoContainer from '../components/Common/CardInfoContainer';

import './CameraPlaySelectWordVerbPage.css';

export default function CameraPlaySelectWordVerbPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const firstCard = location.state?.firstCard || {
    name: 'Unknown',
    image: 'default',
  };
  const secondCard = location.state?.secondCard || {
    name: 'Unknown',
    image: 'default',
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/camera-play-select/word/verb/sentence', {
        state: { firstCard, secondCard },
      });
    }, 7000); //

    return () => clearTimeout(timer);
  }, [navigate, firstCard, secondCard]);

  return (
    <div>
      <NavbarContainer>
        <BackPlaySelectButton />
      </NavbarContainer>

      <div className="CameraPlaySelectWordVerbContainer">
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2, ease: 'easeOut' }}
        >
          <CardInfoContainer
            imageSrc={`/src/assets/card/${firstCard.image}.png`}
            cardName={firstCard.name}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 2 }}
          className="Plus"
        >
          <p>+</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2, ease: 'easeOut', delay: 3.5 }}
        >
          <CardInfoContainer
            imageSrc={`/src/assets/card/${secondCard.image}.png`}
            cardName={secondCard.name}
          />
        </motion.div>
      </div>
    </div>
  );
}
