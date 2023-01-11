import { createSlice } from "@reduxjs/toolkit";

export const errorMessagePokemonsSlice = createSlice({
  name: "errorMessagePokemons",
  initialState: {
    errorMessagePokemons: ""
  },
  reducers: {
    errorMessagePokemons: (state, action) => {
      state.errorMessagePokemons = action.payload;
    }
  }
});

export const { errorMessagePokemons } = errorMessagePokemonsSlice.actions;

export default errorMessagePokemonsSlice.reducer;