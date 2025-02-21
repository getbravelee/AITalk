// 치료 아동 데이터 타입 정의
export interface CareChild {
    id: number;
    therapistId: number;
    centerId: number;
    childName: string;
    protectorNumber: string;
    profileImage: string | null;
    disabilityType: string;
    age: number;
  }
  
  // 더미 데이터
  export const careChildrenDummyData: CareChild[] = [
    { id: 1, therapistId: 1, centerId: 3, childName: '서연', protectorNumber: '010-1234-0001', profileImage: null, disabilityType: '언어 장애', age: 5 },
    { id: 2, therapistId: 1, centerId: 1, childName: '서연', protectorNumber: '010-1234-0002', profileImage: null, disabilityType: '지적 장애', age: 2 },
    { id: 3, therapistId: 1, centerId: 3, childName: '유준', protectorNumber: '010-1234-0003', profileImage: null, disabilityType: '지적 장애', age: 3 },
    { id: 4, therapistId: 1, centerId: 3, childName: '서연', protectorNumber: '010-1234-0004', profileImage: null, disabilityType: '발달 지연', age: 4 },
    { id: 5, therapistId: 1, centerId: 2, childName: '수아', protectorNumber: '010-1234-0005', profileImage: null, disabilityType: '발달 지연', age: 4 },
    { id: 6, therapistId: 1, centerId: 1, childName: '서윤', protectorNumber: '010-1234-0006', profileImage: null, disabilityType: '언어 장애', age: 6 },
    { id: 7, therapistId: 1, centerId: 2, childName: '준서', protectorNumber: '010-1234-0007', profileImage: null, disabilityType: '청각 장애', age: 5 },
    { id: 8, therapistId: 1, centerId: 3, childName: '예은', protectorNumber: '010-1234-0008', profileImage: null, disabilityType: '자폐 스펙트럼', age: 3 },
    { id: 9, therapistId: 1, centerId: 2, childName: '도윤', protectorNumber: '010-1234-0009', profileImage: null, disabilityType: '지적 장애', age: 2 },
    { id: 10, therapistId: 1, centerId: 1, childName: '하은', protectorNumber: '010-1234-0010', profileImage: null, disabilityType: '언어 장애', age: 4 },
    { id: 11, therapistId: 1, centerId: 3, childName: '민준', protectorNumber: '010-1234-0011', profileImage: null, disabilityType: '발달 지연', age: 6 },
    { id: 12, therapistId: 1, centerId: 2, childName: '수아', protectorNumber: '010-1234-0012', profileImage: null, disabilityType: '자폐 스펙트럼', age: 5 },
    { id: 13, therapistId: 1, centerId: 1, childName: '유준', protectorNumber: '010-1234-0013', profileImage: null, disabilityType: '언어 장애', age: 3 },
    { id: 14, therapistId: 1, centerId: 3, childName: '서윤', protectorNumber: '010-1234-0014', profileImage: null, disabilityType: '청각 장애', age: 2 },
    { id: 15, therapistId: 1, centerId: 1, childName: '준서', protectorNumber: '010-1234-0015', profileImage: null, disabilityType: '발달 지연', age: 4 },
    { id: 16, therapistId: 1, centerId: 2, childName: '민준', protectorNumber: '010-1234-0016', profileImage: null, disabilityType: '언어 장애', age: 5 },
    { id: 17, therapistId: 1, centerId: 2, childName: '서연', protectorNumber: '010-1234-0017', profileImage: null, disabilityType: '지적 장애', age: 3 },
    { id: 18, therapistId: 1, centerId: 1, childName: '예은', protectorNumber: '010-1234-0018', profileImage: null, disabilityType: '청각 장애', age: 6 },
    { id: 19, therapistId: 1, centerId: 3, childName: '도윤', protectorNumber: '010-1234-0019', profileImage: null, disabilityType: '발달 지연', age: 2 },
    { id: 20, therapistId: 1, centerId: 2, childName: '하은', protectorNumber: '010-1234-0020', profileImage: null, disabilityType: '자폐 스펙트럼', age: 4 },
    { id: 21, therapistId: 1, centerId: 3, childName: '박응애', protectorNumber: '010-1234-0021', profileImage: null, disabilityType: '언어 장애', age: 5 }
  ];
  