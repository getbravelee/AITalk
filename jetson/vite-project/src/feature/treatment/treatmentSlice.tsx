import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TreatmentState {
  treatmentId: string | null;
}

const initialState: TreatmentState = {
  treatmentId: null,
};

const treatmentSlice = createSlice({
  name: "treatment",
  initialState,
  reducers: {
    setTreatmentId: (state, action: PayloadAction<string>) => {
      state.treatmentId = action.payload;
    },
  },
});

export const { setTreatmentId } = treatmentSlice.actions;
export default treatmentSlice.reducer;
