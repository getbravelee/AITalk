import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import './MyPage.css';

export default function MyPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    phone: {
      first: '',
      middle: '',
      last: '',
    },
  });

  useEffect(() => {
    axiosInstance
      .get('/user/info')
      .then((response) => {
        const { id, name, email, phoneNumber } = response.data;

        const [first, middle, last] = phoneNumber.split('-');
        setFormData({
          name,
          username: id,
          password: '',
          confirmPassword: '',
          email,
          phone: { first, middle, last },
        });
      })
      .catch((error) => {
        console.error('사용자 정보를 불러오는데 실패했습니다.', error);
      });
  }, []);

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

    const payload = {
      email: formData.email,
      newPassword: formData.password,
      confirmPassword: formData.confirmPassword,
      phoneNumber: `${formData.phone.first}-${formData.phone.middle}-${formData.phone.last}`,
    };

    axiosInstance
      .put('/user/info', payload)
      .then((response) => {
        if (response.status === 200) {
          alert('회원정보 수정이 완료되었습니다!');
          navigate('/main/home');
        }
      })
      .catch((error) => {
        console.error('회원정보 수정 실패:', error);
        alert('회원정보 수정 중 오류가 발생했습니다.');
      });
  };

  return (
    <div className="mypage-container">
      <h1>회원정보 수정</h1>
      <form onSubmit={handleSubmit} autoComplete="off">
        <label>이름</label>
        <input type="text" name="name" value={formData.name} readOnly />

        <label>아이디</label>
        <input type="text" name="username" value={formData.username} readOnly />

        <label>비밀번호</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          autoComplete="new-password"
        />

        <label>비밀번호 확인</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          autoComplete="new-password"
        />

        <label>이메일</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label>전화번호</label>
        <div className="phone-inputs">
          <input
            type="text"
            name="first"
            value={formData.phone.first}
            onChange={handleChange}
            maxLength={3}
          />
          <span>-</span>
          <input
            type="text"
            name="middle"
            value={formData.phone.middle}
            onChange={handleChange}
            maxLength={4}
          />
          <span>-</span>
          <input
            type="text"
            name="last"
            value={formData.phone.last}
            onChange={handleChange}
            maxLength={4}
          />
        </div>

        <div className="btn-container">
          <button type="submit" className="submit-btn">
            수정하기
          </button>
        </div>
      </form>
    </div>
  );
}
