import { useState } from 'react';
import './MyPage.css';

export default function MyPage() {
  const [formData, setFormData] = useState({
    name: '김길동',           // ✅ 이름 (수정 불가)
    username: 'gildong',       // ✅ 아이디 (수정 불가)
    password: '',
    confirmPassword: '',
    email: 'gildong@example.com',
    phone: {
      first: '010',
      middle: '0000',
      last: '0000'
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'first' || name === 'middle' || name === 'last') {
      setFormData({ ...formData, phone: { ...formData.phone, [name]: value } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다!');
      return;
    }
    console.log('수정된 정보:', formData);
    alert('회원 정보가 수정되었습니다!');
  };

  const handleReset = () => {
    setFormData({
      name: '김길동',          // 초기화 시에도 값 유지
      username: 'gildong',
      password: '',
      confirmPassword: '',
      email: 'gildong@example.com',
      phone: { first: '', middle: '', last: '' }
    });
  };

  return (
    <div className="mypage-container">
      <h1>회원정보 수정</h1>
      <form onSubmit={handleSubmit}>
        <label>이름</label>
        <input type="text" name="name" value={formData.name} readOnly /> {/* ✅ 수정 불가 */}

        <label>아이디</label>
        <input type="text" name="username" value={formData.username} readOnly /> {/* ✅ 수정 불가 */}

        <label>비밀번호</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} required />

        <label>비밀번호 확인</label>
        <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />

        <label>이메일</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />

        <label>전화번호</label>
        <div className="phone-inputs">
          <input type="text" name="first" value={formData.phone.first} onChange={handleChange} maxLength={3} />
          <span>-</span>
          <input type="text" name="middle" value={formData.phone.middle} onChange={handleChange} maxLength={4} />
          <span>-</span>
          <input type="text" name="last" value={formData.phone.last} onChange={handleChange} maxLength={4} />
        </div>

        <div className="btn-container">
          <button type="submit" className="submit-btn">수정하기</button>
          <button type="button" className="reset-btn" onClick={handleReset}>다시쓰기</button>
        </div>
      </form>
    </div>
  );
}
