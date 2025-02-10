import { Link, useNavigate } from 'react-router-dom';

export default function UserLoginPage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/main/home');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>로그인</h1>

      <button onClick={handleLogin} style={{ marginBottom: '10px' }}>
        로그인
      </button>

      <div style={{ marginTop: '10px' }}>
        <Link to="/user/signup" style={{ marginRight: '10px' }}>
          회원가입
        </Link>
        <Link to="/user/find-id" style={{ marginRight: '10px' }}>
          아이디 찾기
        </Link>
        <Link to="/user/find-pw">비밀번호 찾기</Link>
      </div>
    </div>
  );
}
