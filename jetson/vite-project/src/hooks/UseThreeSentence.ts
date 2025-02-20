// import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UseThreeSentence = () => {
  const navigate = useNavigate()

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
        navigate('/card-play-select/three-sentence', {
          state: {
            text: data.text,
            image: data.image,
          },
        });
      } else {
        console.error('인증 실패');
      }
    } catch (error) {
      console.error('서버 요청 중 에러 발생:', error);
    }
  };

  return { generateSentence };
};
export default UseThreeSentence;
