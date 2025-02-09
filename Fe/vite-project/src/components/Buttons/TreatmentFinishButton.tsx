import React, { useState } from 'react';
import { Button } from '@chakra-ui/react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../feature/store';
import { clearChild } from '../../feature/child/childSlice';
import { useNavigate } from 'react-router-dom';

const FinishTreatmentButton: React.FC = () => {
  const currentChildId = useSelector((state: RootState) => state.child.currentChildId);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFinishTreatment = async () => {
    if (!currentChildId) {
      alert("선택된 아이의 정보가 없습니다.");
      return;
    }

    setIsSubmitting(true);

    try {
      // api 주소 생기면 수정 필요
      const response = await fetch('http://192.168.30.146:5000/child/dummy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ child_id: currentChildId }),
      });

      if (!response.ok) {
        throw new Error(`서버 응답 에러 (Status: ${response.status})`);
      }

      alert("치료 완료 정보가 서버에 전송되었습니다.");
      // 해당 아동의 redux persist 제거
      dispatch(clearChild());
      navigate('/treatment-complete');
    } catch (error) {
      console.error('치료 완료 전송 실패:', error);
      alert("치료 완료 전송에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Button onClick={handleFinishTreatment} isLoading={isSubmitting}>
      치료 완료!
    </Button>
  );
};

export default FinishTreatmentButton;
