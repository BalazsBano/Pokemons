import { createSlice } from "@reduxjs/toolkit";

export const modalShowSlice = createSlice({
  name: "modalShow",
  initialState: {
    isModalShowing: false
  },
  reducers: {
    isModalShowingTrue: (state) => {
      state.isModalShowing = true;
    },
    isModalShowingFalse: (state) => {
      state.isModalShowing = false;
    }
  }
});

export const { isModalShowingFalse, isModalShowingTrue } = modalShowSlice.actions;

export default modalShowSlice.reducer;