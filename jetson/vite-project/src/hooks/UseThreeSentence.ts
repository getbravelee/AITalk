import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UseThreeSentence = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const navigate = useNavigate();
  const generateSentence = async (schedule_id: number, word: string) => {
    try {
      const response = await fetch(`http://localhost:5000/generate-sentence`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schedule_id, word }),
      });

      const data = await response.json();
      console.log(data);
      if (Number(response.status) === 200) {
<<<<<<< HEAD
        navigate('/card-play-select/three-sentence', {
          state: {
            text: data.text,
            image: data.image,
          },
        });
=======
        navigate('/card-play-select/three-sentence' , {state: {
          text: data.text,
          image: data.image
        }})
>>>>>>> 73181f52967c356dc8d556b78243785c8e17787a
      } else {
        console.error('인증 실패');
      }
    } catch (error) {
      console.error('서버 요청 중 에러 발생:', error);
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    setIsVerifying(true);
  }, []);

  return { isVerifying, generateSentence };
};
export default UseThreeSentence;
