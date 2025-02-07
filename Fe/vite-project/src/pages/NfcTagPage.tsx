<<<<<<< HEAD
=======
import { motion } from 'framer-motion';

import BackgroundKidContainer from '../components/Common/BackgroundKidContainer';
>>>>>>> develop
import NavbarContainer from '../components/Common/NavbarContainer';
import BackButton from '../components/Common/BackButton';
import LoadingCircle from '../components/Common/LoadingCircle';
import NfcImage from '../components/Images/NfcImage';
import NfcTagText from '../components/Texts/NfcTagText';

import './NfcTagPage.css';

export default function NfcTagPage() {
  return (
<<<<<<< HEAD
    <div>
      {/* NavbarContainer 내부에 BackButton을 children으로 전달 */}
      <NavbarContainer>
        <BackButton />
      </NavbarContainer>
      <div className="NfcTagContainer">
        <LoadingCircle />
        <NfcImage />
        <NfcTagText />
=======
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <NavbarContainer />
        <BackgroundKidContainer />
>>>>>>> develop
      </div>
    </div>
  );
}
