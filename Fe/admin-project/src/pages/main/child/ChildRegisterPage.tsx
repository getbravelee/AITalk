import { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // ✅ 추가
import axiosInstance from '../../../utils/axiosInstance';
import './ChildRegisterPage.css';

export default function ChildRegisterPage() {
  const navigate = useNavigate();  // ✅ 네비게이션 훅 사용

  const [formData, setFormData] = useState({
    centerId: '',
    childName: '',
    protectorNumber: '',
    profileImage: '',
    disabilityType: '',
    age: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const requestBody = {
      centerId: Number(formData.centerId),
      childName: formData.childName,
      protectorNumber: formData.protectorNumber,
      profileImage: formData.profileImage,
      disabilityType: formData.disabilityType,
      age: Number(formData.age),
    };

    try {
      const token = localStorage.getItem('token');

      const response = await axiosInstance.post('/child/register', requestBody, {
        headers: {
          Authorization: token,
        },
      });

      if (response.status === 201) {  // ✅ 201 Created일 때만 처리
        console.log('아동 등록 성공:', response.data);
        alert('아동 등록이 완료되었습니다!');
        navigate('/main/child/list');  // ✅ 등록 성공 후 ChildListPage로 이동
      }
    } catch (error) {
      console.error('등록 실패:', error);
      alert('아동 등록에 실패했습니다.');
    }
  };

  return (
    <div className="register-container">
      <h1>아동 등록</h1>
      <form onSubmit={handleSubmit}>
        <label>아동 이름:</label>
        <input type="text" name="childName" value={formData.childName} onChange={handleChange} required />

        <label>센터 ID:</label>
        <input type="number" name="centerId" value={formData.centerId} onChange={handleChange} required />

        <label>보호자 연락처:</label>
        <input type="tel" name="protectorNumber" value={formData.protectorNumber} onChange={handleChange} required />

        <label>프로필 이미지 URL:</label>
        <input type="text" name="profileImage" value={formData.profileImage} onChange={handleChange} />

        <label>장애 유형:</label>
        <select name="disabilityType" value={formData.disabilityType} onChange={handleChange} required>
          <option value="">선택하세요</option>
          <option value="언어 장애">언어 장애</option>
          <option value="지적 장애">지적 장애</option>
          <option value="발달 지연">발달 지연</option>
          <option value="자폐 스펙트럼">자폐 스펙트럼</option>
          <option value="청각 장애">청각 장애</option>
        </select>

        <label>나이:</label>
        <input type="number" name="age" value={formData.age} onChange={handleChange} required />

        <button type="submit">등록하기</button>
      </form>
    </div>
  );
}
