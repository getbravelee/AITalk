import { Button } from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearUser } from '../../feature/user/userSlice';
import { clearChild } from '../../feature/child/childSlice';
import { clearTreatmentId } from '../../feature/treatment/treatmentSlice';
import '../Texts/TextFontFromGoogle.css';

function LogoutButton() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    // confirm 창을 띄워 사용자에게 로그아웃 여부를 확인합니다.
    if (window.confirm("정말로 로그아웃 하시겠어요?")) {
      dispatch(clearUser());
      dispatch(clearChild());
      dispatch(clearTreatmentId());
      navigate('/');
    }
  };

  return (
    <Button
      fontSize={35}
      onClick={handleLogout}
      className="font"
      rounded='xl'
      backgroundColor='#FFC100'
      color='black'
    >
      로그아웃
    </Button>
  );
}

export default LogoutButton;
