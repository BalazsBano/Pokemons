import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const catchedPokemonsStateSlice = createSlice({
  name: "catchedPokemonsState",
  initialState: {
    catchedPokemonsState: [] as string[]
  },
  reducers: {
    catchedPokemonsState: (state, action: PayloadAction<string>) => {
      if (state.catchedPokemonsState.includes(action.payload)){
        state.catchedPokemonsState.splice(state.catchedPokemonsState.indexOf(action.payload), 1);
      } else {
        state.catchedPokemonsState.push(action.payload);
      }
    }
  }
});

export const { catchedPokemonsState } = catchedPokemonsStateSlice.actions;

export default catchedPokemonsStateSlice.reducer;