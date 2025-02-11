import { useState } from 'react';
import './ChildRegisterPage.css';

export default function ChildRegisterPage() {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('등록된 아동 정보:', formData);
    alert('아동 등록이 완료되었습니다!');
    // TODO: 서버로 POST 요청 보내기 (axios 등)
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

        <button className='regist-button' type="submit">등록하기</button>
      </form>
    </div>
  );
}
