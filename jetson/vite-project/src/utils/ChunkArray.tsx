
// 필요시 ChildData 타입을 types/child.ts에서 import하거나 아래와 같이 정의할 수 있습니다.
export interface ChildData {
  id: number;
  name: string;
  age: number;
  profileImage: string;
  center: string;
  disability_type: string;
  // 기타 필드 추가 가능
}

/* 배열을 주어진 크기로 그룹핑하는 함수 */
export const ChunkArray = (arr: ChildData[], size: number): ChildData[][] => {
  const chunks: ChildData[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};
