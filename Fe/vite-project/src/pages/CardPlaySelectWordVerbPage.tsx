import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import NavbarContainer from '../components/Common/NavbarContainer';
import BackButton from '../components/Common/BackButton';
import CardInfoContainer from '../components/Common/CardInfoContainer';

import './CardPlaySelectWordVerbPage.css';

export default function CardPlaySelectWordVerbPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/card-play-select/word/verb/sentence');
    }, 5000); // 5초 후 이동

    return () => clearTimeout(timer); // 컴포넌트가 언마운트되면 타이머 해제
  }, [navigate]);

  return (
    <div>
      <NavbarContainer>
        <BackButton />
      </NavbarContainer>
      <div className="CardPlaySelectWordVerbContainer">
        <CardInfoContainer
          className="LargeCardInfoContainer"
          imageSrc="/src/assets/card/bread.png"
        />
        <div className="Plus">
          <p>+</p>
        </div>
        <CardInfoContainer
          className="LargeCardInfoContainer"
          imageSrc="/src/assets/card/eat.png"
        />
      </div>
    </div>
  );
}

//
