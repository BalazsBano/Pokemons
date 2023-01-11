import { createSlice } from "@reduxjs/toolkit";

export const errorMessagePokemonTypesSlice = createSlice({
  name: "errorMessagePokemonTypes",
  initialState: {
    errorMessagePokemonTypes: ""
  },
  reducers: {
    errorMessagePokemonTypes: (state, action) => {
      state.errorMessagePokemonTypes = action.payload;
    }
  }
});

export const { errorMessagePokemonTypes } = errorMessagePokemonTypesSlice.actions;

export default errorMessagePokemonTypesSlice.reducer;