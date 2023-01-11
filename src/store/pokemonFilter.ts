import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IPokemon } from "../api/getPokemonTypes/types";

export const pokemonFilterStateSlice = createSlice({
  name: "pokemonFilterState",
  initialState: {
    pokemonFilterState: [] as IPokemon[]
  },
  reducers: {
    pokemonFilterState: (state, action: PayloadAction<IPokemon[]>) => {
      state.pokemonFilterState = action.payload;
    }
  }
});

export const { pokemonFilterState } = pokemonFilterStateSlice.actions;

export default pokemonFilterStateSlice.reducer;