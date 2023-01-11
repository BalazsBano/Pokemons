import { createSlice } from "@reduxjs/toolkit";

export const catchPokemonSlice = createSlice({
  name: "catchPokemon",
  initialState: {
    isCatched: false
  },
  reducers: {
    isCatchedTrue: (state) => {
      state.isCatched = true;
    },
    isCatchedFalse: (state) => {
      state.isCatched = false;
    }
  }
});

export const { isCatchedFalse, isCatchedTrue } = catchPokemonSlice.actions;

export default catchPokemonSlice.reducer;