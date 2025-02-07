import { useLocation } from 'react-router-dom';
import NavbarContainer from '../components/Common/NavbarContainer';
import BackPlaySelectButton from '../components/Common/BackPlaySelectButton';
import AiInfoContainer from '../components/Common/AiInfoContainer';

import './AiTalkPage.css';

export default function AiTalkPage() {
  const location = useLocation();
  const aiText = location.state?.aiText || '안녕! 난 톡톡이야';

  return (
    <div>
      <NavbarContainer>
        <BackPlaySelectButton />
      </NavbarContainer>
      <div className="AiTalkContainer">
        <AiInfoContainer aiText={aiText} />
      </div>
    </div>
  );
}
