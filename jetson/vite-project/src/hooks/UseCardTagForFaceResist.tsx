import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';

const UseCardTagForFaceResist = () => {
  const navigate = useNavigate();
  const currentUser = useSelector((state: any) => state.user.currentUser);

  const handleCardTagForFaceResist = useCallback(async () => {
    if (currentUser) {
      navigate('/TherapistFaceResisterPage', { state: currentUser });
      return;
    }

    console.log('📡 Fetching card data from server...');
    navigate('/nfc-tag');

    try {
      const response = await fetch('http://localhost:5000/user/card-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch card data (Status: ${response.status})`);
      }

      const cardData = await response.json();
      console.log('✅ Server Response Data:', cardData);
      
      // navigate('/nfc-tag');
      setTimeout(() => {
        navigate('/TherapistFaceResisterPage', { state: cardData });
      }, 2000);
    } catch (error) {
      console.error('❌ Error fetching card data:', error);
    }
  }, [currentUser, navigate]);

  return handleCardTagForFaceResist;
};

export default UseCardTagForFaceResist;
