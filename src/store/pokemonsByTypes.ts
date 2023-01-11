import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IPokemon } from "../api/getPokemonTypes/types";

export const pokemonsByTypesStateSlice = createSlice({
  name: "pokemonsByTypesState",
  initialState: {
    pokemonsByTypesState: [] as IPokemon[]
  },
  reducers: {
    pokemonsByTypesState: (state, action: PayloadAction<IPokemon[]>) => {
      state.pokemonsByTypesState = action.payload;
    }
  }
});

export const { pokemonsByTypesState } = pokemonsByTypesStateSlice.actions;

export default pokemonsByTypesStateSlice.reducer;