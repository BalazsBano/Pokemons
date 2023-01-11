import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IPokemon } from "../api/getPokemonTypes/types";

export const pokemonTypesSlice = createSlice({
  name: "pokemonTypes",
  initialState: {
    typesOfPokemons: [] as IPokemon[]
  },
  reducers: {
    typesOfPokemons: (state, action: PayloadAction<IPokemon[]>) => {
      state.typesOfPokemons = action.payload;
    }
  }
});

export const { typesOfPokemons } = pokemonTypesSlice.actions;

export default pokemonTypesSlice.reducer;