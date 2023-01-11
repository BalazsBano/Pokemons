import { createSlice } from "@reduxjs/toolkit";

export const searchSlice = createSlice({
  name: "search",
  initialState: {
    search: ""
  },
  reducers: {
    searchString: (state, action) => {
      state.search = action.payload;
    }
  }
});

export const { searchString } = searchSlice.actions;

export default searchSlice.reducer;