import React from 'react';
import { Button } from '@chakra-ui/react';
import UseFinishTreatment from '../../hooks/UseFinishTreatment';

/**
 * FinishTreatmentButton 컴포넌트
 * 
 * 이 컴포넌트는 "치료 완료!" 버튼을 렌더링하며, 클릭 시 UseFinishTreatment hook에서 제공하는
 * finishTreatment 함수를 호출하여 치료 완료 처리를 진행합니다.
 */
const FinishTreatmentButton: React.FC = () => {
  // UseFinishTreatment hook을 사용해 finishTreatment 함수와 isSubmitting 상태를 가져옵니다.
  const { finishTreatment, isSubmitting } = UseFinishTreatment();

  return (
    <Button onClick={finishTreatment} isLoading={isSubmitting}>
      치료 완료!
    </Button>
  );
};

export default FinishTreatmentButton;
