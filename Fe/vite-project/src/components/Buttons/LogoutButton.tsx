import { Button } from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearUser } from '../../feature/user/userSlice';
import '../Texts/TextFontFromGoogle.css';

function LogoutButton() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    // confirm 창을 띄워 사용자에게 로그아웃 여부를 확인합니다.
    if (window.confirm("정말로 로그아웃 하시겠어요?")) {
      dispatch(clearUser());
      navigate('/');
    }
  };

  return (
    <Button
      height="3"
      width="2"
      fontSize={10}
      onClick={handleLogout}
      className="font"
      backgroundColor={'lightgrey'}
      color='black'
    >
      로그아웃
    </Button>
  );
}

export default LogoutButton;
