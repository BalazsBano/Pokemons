import { createSlice } from "@reduxjs/toolkit";

export interface Loading {
  isLoading: boolean
}

export const loadingSlice = createSlice({
  name: "loading",
  initialState: {
    isLoading: false
  },
  reducers: {
    isLoadingTrue: (state) => {
      state.isLoading = true;
    },
    isLoadingFalse: (state) => {
      state.isLoading = false;
    }
  }
});

export const { isLoadingFalse, isLoadingTrue } = loadingSlice.actions;

export default loadingSlice.reducer;