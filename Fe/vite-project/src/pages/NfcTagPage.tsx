import { motion } from 'framer-motion';

import BackgroundContainerKid from '../components/Common/BackgroundContainerKid';
import NavbarContainer from '../components/Common/NavbarContainer';

function NfcTagPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <NavbarContainer />
        <BackgroundContainerKid />
      </div>
    </motion.div>
  );
}

export default NfcTagPage;
