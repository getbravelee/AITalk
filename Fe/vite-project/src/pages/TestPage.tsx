import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; // 📌 useNavigate 훅 가져오기

function TestPage() {
  const navigate = useNavigate(); // 📌 페이지 이동을 위한 함수

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <h1>Test Page</h1>
        <button
          onClick={() => {
            navigate('/nfc'); // 📌 'localhost:5173/nfc' 경로로 이동 (NfcTagPage로 이동)
          }}
        >
          NFC
        </button>
        <button
          onClick={() => {
            navigate('/'); // 📌 'localhost:5173/nfc' 경로로 이동 (NfcTagPage로 이동)
          }}
        >
          HOME
        </button>
      </div>
    </motion.div>
  );
}

export default TestPage;
