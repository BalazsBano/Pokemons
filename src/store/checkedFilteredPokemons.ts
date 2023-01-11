import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IPokemon } from "../api/getPokemonTypes/types";

export const pokemonCheckboxFilterStateSlice = createSlice({
  name: "pokemonCheckboxFilterState",
  initialState: {
    pokemonCheckboxFilterState: [] as IPokemon[]
  },
  reducers: {
    pokemonCheckboxFilterState: (state, action: PayloadAction<IPokemon[]>) => {
      state.pokemonCheckboxFilterState = action.payload;
    }
  }
});

export const { pokemonCheckboxFilterState } = pokemonCheckboxFilterStateSlice.actions;

export default pokemonCheckboxFilterStateSlice.reducer;