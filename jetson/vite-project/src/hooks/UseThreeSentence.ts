import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UseThreeSentence = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const navigate = useNavigate()
  const generateSentence = async (schedule_id: number, word: string) => {
    try {
      const response = await fetch(`http://localhost:5000/generate-sentence`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({schedule_id, word}),
      });

      const data = await response.json();
      console.log(data)
      if (Number(response.status) === 200) {
        alert(`카드의 텍스트는 ${data.text}입니다.`)
        navigate('/card-play-select/three-sentence' , {state: {
          text: data.text,
          image: data.image
        }})
      } else {
        console.error('인증 실패');
        alert('인증이 실패했습니다! 다시 시도해주세요!');
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
