import { motion } from 'framer-motion';

import BackgroundContainer from '../components/BackgroundContainer';
import NavbarContainer from '../components/NavbarContainer';

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
        <BackgroundContainer />
      </div>
    </motion.div>
  );
}

export default NfcTagPage;
