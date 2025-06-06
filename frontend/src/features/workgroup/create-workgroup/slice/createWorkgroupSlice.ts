import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface FormState {
  step1: { name: string; email: string };
  step2: { age: string; gender: string };
  step3: { address: string; city: string };
  step4: {}; // reserved for future steps
}

const initialState: FormState = {
  step1: { name: '', email: '' },
  step2: { age: '', gender: '' },
  step3: { address: '', city: '' },
  step4: {},
};

const createWorkgroupSlice = createSlice({
  name: 'multiStepForm',
  initialState,
  reducers: {
    setStep1: (state, action: PayloadAction<FormState['step1']>) => {
      state.step1 = action.payload;
    },
    setStep2: (state, action: PayloadAction<FormState['step2']>) => {
      state.step2 = action.payload;
    },
    setStep3: (state, action: PayloadAction<FormState['step3']>) => {
      state.step3 = action.payload;
    },
    resetForm: () => initialState,
  },
});

export const { setStep1, setStep2, setStep3, resetForm } =
  createWorkgroupSlice.actions;
export default createWorkgroupSlice.reducer;
