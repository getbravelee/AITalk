// feature/child/childSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Child {
  id: number;
  name: string;
  age: number;
  profileImage: string;
  center: string;
  disability_type: string;
  // 필요한 다른 필드들
}

interface ChildState {
  // 현재 선택된 아이의 데이터
  currentChild: Child | null;
}

const initialState: ChildState = {
  currentChild: null,
};

const childSlice = createSlice({
  name: 'child',
  initialState,
  reducers: {
    // 카드 클릭 등으로 아이를 선택했을 때 호출
    setChildId(state, action: PayloadAction<Child>) {
      state.currentChild = action.payload;
    },
    // 치료 완료 등으로 아이 정보를 초기화할 때 호출
    clearChild(state) {
      state.currentChild = null;
    },
  },
});

export const { setChildId, clearChild } = childSlice.actions;
export default childSlice.reducer;
