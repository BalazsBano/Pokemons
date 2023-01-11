import { createSlice } from "@reduxjs/toolkit";

export const checkboxSlice = createSlice({
  name: "checkbox",
  initialState: {
    isChecked: false
  },
  reducers: {
    isCheckedTrue: (state) => {
      state.isChecked = true;
    },
    isCheckedFalse: (state) => {
      state.isChecked = false;
    }
  }
});

export const { isCheckedFalse, isCheckedTrue } = checkboxSlice.actions;

export default checkboxSlice.reducer;