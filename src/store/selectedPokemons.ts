import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ISelectedPokemon } from "../api/configuration/types";

export const selectedPokemonStateSlice = createSlice({
  name: "selectedPokemonState",
  initialState: {
    selectedPokemonState: {} as ISelectedPokemon
  },
  reducers: {
    selectedPokemonState: (state, action: PayloadAction<ISelectedPokemon>) => {
      state.selectedPokemonState = action.payload;
    }
  }
});

export const { selectedPokemonState } = selectedPokemonStateSlice.actions;

export default selectedPokemonStateSlice.reducer;