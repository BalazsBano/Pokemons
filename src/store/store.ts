import { configureStore } from '@reduxjs/toolkit';
import loadingReducer from "./loading";
import checkboxReducer from "./checkbox";
import modalShowReducer from "./modalShow";
import catchPokemonReducer from "./catchPokemon";
import catchedPokemonsStateReducer from "./catchedPokemons";
import searchReducer from './search';
import errorMessagePokemonsReducer from './errorMessagePokemons';
import errorMessagePokemonTypesReducer from './errorMessagePokemonTypes';
import pokemonTypesReducer from './pokemonTypes';
import pokemonsByTypesStateReducer from './pokemonsByTypes';
import pokemonFilterStateReducer from './pokemonFilter';
import pokemonCheckboxFilterStateReducer from './checkedFilteredPokemons';
import selectedPokemonStateReducer from './selectedPokemons';

export const store = configureStore({
  reducer: {
    loading: loadingReducer,
    checkbox: checkboxReducer,
    modalShow: modalShowReducer,
    catchPokemon: catchPokemonReducer,
    catchedPokemonsState: catchedPokemonsStateReducer,
    search: searchReducer,
    errorMessagePokemons: errorMessagePokemonsReducer,
    errorMessagePokemonTypes: errorMessagePokemonTypesReducer,
    typesOfPokemons: pokemonTypesReducer,
    pokemonsByTypesState: pokemonsByTypesStateReducer,
    pokemonFilterState: pokemonFilterStateReducer,
    pokemonCheckboxFilterState: pokemonCheckboxFilterStateReducer,
    selectedPokemonState: selectedPokemonStateReducer
  }
})

export type RootState = ReturnType<typeof store.getState>