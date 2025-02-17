import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axiosInstance from '../../../utils/axiosInstance';
import './ChildRegisterPage.css';

export default function ChildRegisterPage() {
  const navigate = useNavigate();  

  const [centers, setCenters] = useState<{ centerId: number; centerName: string }[]>([]); // 센터 리스트
  const [formData, setFormData] = useState({
    centerId: '',
    childName: '',
    profileImage: '',
    disabilityType: '',
    age: '',
    protectorNumber: '',
  });

  // ✅ 센터 리스트 API 호출
  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const response = await axiosInstance.get('/child/center-list');
        console.log("📥 센터 목록 응답:", response.data);
        setCenters(response.data); // 센터 리스트 저장
      } catch (error) {
        console.error("❌ 센터 목록 API 호출 실패:", error);
      }
    };

    fetchCenters();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ✅ 센터 선택 시 centerId 저장
  const handleCenterSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCenterId = e.target.value;
    setFormData({ ...formData, centerId: selectedCenterId });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const requestBody = {
      centerId: Number(formData.centerId), // ✅ 선택한 센터 ID 저장
      childName: formData.childName,
      profileImage: formData.profileImage,
      disabilityType: formData.disabilityType,
      age: Number(formData.age),
      protectorNumber: formData.protectorNumber,
    };

    try {
      const token = localStorage.getItem('token');

      const response = await axiosInstance.post('/child/register', requestBody, {
        headers: {
          Authorization: token,
        },
      });

      if (response.status === 201) {  
        console.log('아동 등록 성공:', response.data);
        alert('아동 등록이 완료되었습니다!');
        navigate('/main/child/list');  
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

        {/* ✅ 센터 선택 드롭다운 추가 */}
        <label>센터 선택:</label>
        <select name="centerId" value={formData.centerId} onChange={handleCenterSelect} required>
          <option value="">센터를 선택하세요</option>
          {centers.map((center) => (
            <option key={center.centerId} value={center.centerId}>
              {center.centerName}
            </option>
          ))}
        </select>

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

        <label>보호자 연락처:</label>
        <input type="tel" name="protectorNumber" value={formData.protectorNumber} onChange={handleChange} required />

        <button className='child-register-button' type="submit">등록하기</button>
      </form>
    </div>
  );
}
