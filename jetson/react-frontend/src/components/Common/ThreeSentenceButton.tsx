import './ThreeSentenceButton.css';
import UseThreeSentence from '../../hooks/UseThreeSentence';
import { useState } from 'react';
import { Mosaic } from "react-loading-indicators"; // 로딩 애니메이션 라이브러리
import { VStack } from '@chakra-ui/react';

interface ThreeSentenceButtonProps {
  className?: string; // ✅ className을 받을 수 있도록 추가
  schedule_id: number;
  word: string;
}

export default function ThreeSentenceButton({
  className = '',
  schedule_id,
  word,
}: ThreeSentenceButtonProps) {
  const { generateSentence } = UseThreeSentence();
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 관리

  const handleClick = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await generateSentence(schedule_id, word);
    } catch (error) {
      console.error('생성 중 오류 발생:', error);
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

  return (
    <button
      className={`ThreeSentenceButton ${className}`}
      onClick={handleClick}
      disabled={isLoading} // 로딩 중에는 버튼 비활성화
    >
      {isLoading ? (
        <>
        <VStack>
        <p>Ai 이미지 생성중</p>
        <Mosaic color={["#33CCCC", "#33CC36", "#B8CC33", "#FCCA00"]} />
        </VStack>
        </>
      ) : (
        <span>상황극</span> // 기본 버튼 텍스트
      )}
    </button>
  );
}
