import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TreatmentState {
  treatmentId: string | null;
}

const initialState: TreatmentState = {
  treatmentId: null,
};

const treatmentSlice = createSlice({
  name: 'treatment',
  initialState,
  reducers: {
    setTreatmentId: (state, action: PayloadAction<string>) => {
      state.treatmentId = action.payload;
    },
    clearTreatmentId: (state) => {
      state.treatmentId = null;
    },
  },
});

export const { setTreatmentId, clearTreatmentId } = treatmentSlice.actions;
export default treatmentSlice.reducer;
