import { useNavigate } from 'react-router-dom';

export default function Main() {
  const navigate = useNavigate(); // useNavigate 훅은 컴포넌트 내부에서 호출해야 함.

  return (
    <div>
      <p>MainPage</p>
      <div>
        {/* onClick 내부에서 함수로 감싸서 실행해야 함 */}
        <button onClick={() => navigate('/')}>UserPage</button>
      </div>
    </div>
  );
}
