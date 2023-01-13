import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Card, Dropdown, Form, Modal, Spinner } from "react-bootstrap";
import { getPokemonTypes, getPokemonsByTypes, getSelectedPokemonsData } from "../../api";
import { IPokemon } from "../../api/getPokemonTypes/types";
import { RootState } from "../../store/store";
import {
  searchString,
  isLoadingFalse,
  isLoadingTrue,
  isCheckedFalse,
  isCheckedTrue,
  isModalShowingFalse,
  isModalShowingTrue,
  isCatchedFalse,
  isCatchedTrue,
  catchedPokemonsState,
  errorMessagePokemonTypes,
  errorMessagePokemons,
  typesOfPokemons,
  pokemonsByTypesState,
  pokemonFilterState,
  pokemonCheckboxFilterState,
  selectedPokemonState
} from "../../store";
import "./style.sass"

export function HomePage(){
  const dispatch = useDispatch();
  const loading = useSelector((state: RootState) => state.loading.isLoading);
  const checkboxIsChecked = useSelector((state: RootState) => state.checkbox.isChecked);
  const show = useSelector((state: RootState) => state.modalShow.isModalShowing);
  const searchInput = useSelector((state: RootState) => state.search.search);
  const errorMessageForPokemons = useSelector((state: RootState) => state.errorMessagePokemons.errorMessagePokemons);
  const errorMessageForPokemonTypes = useSelector((state: RootState) => state.errorMessagePokemonTypes.errorMessagePokemonTypes);
  const pokemonTypes = useSelector((state: RootState) => state.typesOfPokemons.typesOfPokemons);
  const pokemonsByTypes = useSelector((state: RootState) => state.pokemonsByTypesState.pokemonsByTypesState);
  const catchedPokemons = useSelector((state: RootState) => state.catchedPokemonsState.catchedPokemonsState);
  const filteredPokemons = useSelector((state: RootState) => state.pokemonFilterState.pokemonFilterState);
  const checkFilteredPokemons = useSelector((state: RootState) => state.pokemonCheckboxFilterState.pokemonCheckboxFilterState);
  const selectedPokemon = useSelector((state: RootState) => state.selectedPokemonState.selectedPokemonState);

  useEffect(() => {
    dispatch(isLoadingTrue());
    async function getData() {
      const pokemonTyp = await getPokemonTypes();
      if (pokemonTyp.status === 500) {
        dispatch(errorMessagePokemonTypes(pokemonTyp.data));
        console.log(pokemonTyp.status);
      } else {
        dispatch(typesOfPokemons(pokemonTyp.data))
      }
    }
    getData();
    dispatch(isLoadingFalse());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function getPokemons(url: string){
    dispatch(isLoadingTrue());
    const pokemonsByTyp = await getPokemonsByTypes(url);
    if (pokemonsByTyp.status === 500) {
      dispatch(errorMessagePokemons(pokemonsByTyp.data));
      console.log(pokemonsByTyp.status);
    } else {
      let pokemons = []
      for (let i = 0; i < pokemonsByTyp.data.length; i++) {
        pokemons.push({...pokemonsByTyp.data[i].pokemon, catch: false});
      }
      dispatch(pokemonsByTypesState(pokemons));
      dispatch(pokemonFilterState(pokemons));
      dispatch(pokemonCheckboxFilterState(pokemons));
    }
    dispatch(isLoadingFalse());
  }

  async function viewPokemon(url: string, name: string){
    dispatch(isLoadingTrue());
    let catched;
    if(catchedPokemons.includes(name)) {
      catched = true
      dispatch(isCatchedTrue());
    } else {
      catched = false
      dispatch(isCatchedFalse());
    }
    const pokemonData = await getSelectedPokemonsData(url)
    if (pokemonData.status === 500) {
      dispatch(errorMessagePokemons(pokemonData.data));
      console.log(pokemonData.status);
    } else {
      let abilities = [];
      for (let i = 0; i < pokemonData.data.abilities.length; i++) {
        if (pokemonData.data.abilities[i].is_hidden === false) {
          abilities.push(pokemonData.data.abilities[i].ability.name);
        }
      }
      const selectedPokemonData = {
        "name": name,
        "image": pokemonData.data.sprites.other.home.front_default,
        "weight": pokemonData.data.weight,
        "height": pokemonData.data.height,
        "abilities": abilities.join(", "),
        "catch": catched
      }
      dispatch(selectedPokemonState(selectedPokemonData))
      dispatch(isLoadingFalse());
      dispatch(isModalShowingTrue());
    }    
  }

  function filteringPokemons(inputString: string){
    dispatch(searchString(inputString));
    let filtPokemons = [] as IPokemon[];
    if (inputString.length > 0) {
      filtPokemons = pokemonsByTypes.filter((pokemon) => {
        return pokemon.name.match(inputString);
      })
    } else {
      filtPokemons = pokemonsByTypes
    }
    dispatch(pokemonFilterState(filtPokemons));
    dispatch(pokemonCheckboxFilterState(filtPokemons));
  }

  function checkboxFilteredPokemons(){
    const checkFiltPokemons = [] as IPokemon[];
    for (let i = 0; i < catchedPokemons.length; i++) {
      for (let j = 0; j < filteredPokemons.length; j++) {
        if(filteredPokemons[j].name === catchedPokemons[i]){
          checkFiltPokemons.push(filteredPokemons[j])
        }
      }
    }
    dispatch(pokemonCheckboxFilterState(checkFiltPokemons));
  }

  function catchingPokemon(name: string){
    let pokemons = pokemonsByTypes;
    for (let i = 0; i < pokemons.length; i++) {
      if (pokemons[i].name === name) {
        dispatch(catchedPokemonsState(name))
        if (pokemons[i].catch === false) {
          dispatch(isCatchedTrue());
        } 
        if (pokemons[i].catch === true) {
          dispatch(isCatchedFalse());
        }
      }
    }
    dispatch(pokemonsByTypesState(pokemons))
  }

  function handleCheckbox(e: any) {
    if (checkboxIsChecked === false) {
      dispatch(isCheckedTrue());
      checkboxFilteredPokemons();
    } else {
      dispatch(isCheckedFalse());
      dispatch(pokemonCheckboxFilterState(filteredPokemons));
    }
  }


  return (
    <div>
      {loading ? (
        <div className="d-flex justify-content-center mt-5">
          <Spinner className="spinner-border text-info"></Spinner>
        </div>
      ) : (
        <div className="h-100 mt-3 d-flex flex-column justify-content-center align-items-center">
          <Dropdown>
            <Dropdown.Toggle className="dropdown-toggle rounded-pill border-0">Choose Pokemon type</Dropdown.Toggle>
            <Dropdown.Menu>
              {pokemonTypes.map((item, index) => (
                <Dropdown.Item key={index} as="button" onClick={() => getPokemons(item.url)}>{item.name}</Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          {!errorMessageForPokemonTypes ? (
            null
          ) : (
            <h3>{errorMessageForPokemonTypes}</h3>
          )}
        <div>
          <Form>
            <Form.Control className="my-3" type="text" placeholder="Search here" onChange={(e) => {filteringPokemons(e.target.value)}} value={searchInput}></Form.Control>
            <Form.Check onChange={(e) => handleCheckbox(e)} className="ms-3 me-1" label="Catched Pokemons" value={checkboxIsChecked.toString()}></Form.Check>
          </Form>
        </div>
      </div>
      )}

      <div className="h-100 mt-3 d-flex flex-column justify-content-center align-items-center">
        <div className="d-lg-flex flex-column row g-3 m-5 w-50">
          {!errorMessageForPokemons ? (
            checkFilteredPokemons.map((item, index) => {
              return (
                <div key={index} className="col-lg-12">
                  <Card className={
                    catchedPokemons.includes(item.name) ? (
                      "card mx-3 border-success"
                      ):(
                      "card mx-3"
                      )} onClick={() => viewPokemon(item.url, item.name)}>
                    <Card.Body className="">
                      <Card.Title className="title fs-6">
                        Pokemon
                      </Card.Title>
                      <Card.Subtitle className="subtitle fs-6 text-capitalize">
                        {item.name}
                      </Card.Subtitle>
                    </Card.Body>
                  </Card>
                </div>
              )
            })
          ) : (
            <h3>{errorMessageForPokemons}</h3>
          )}
        </div>
      </div>

      <div>
        <Modal show={show} onHide={() => dispatch(isModalShowingFalse())} >
          <Modal.Header closeButton>
            <Modal.Title>{selectedPokemon.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <img className="w-100" src={selectedPokemon.image} alt="Pokemon" />
            <p>Weight: {selectedPokemon.weight}</p>
            <p>Height: {selectedPokemon.height}</p>
            <p>Unhidden abilities: {selectedPokemon.abilities}</p>
          </Modal.Body>
          <Modal.Footer>
            {catchedPokemons.includes(selectedPokemon.name) ? (
              <Button type="button" onClick={() => catchingPokemon(selectedPokemon.name)}>Release</Button>
              ) : (
              <Button type="button" onClick={() => catchingPokemon(selectedPokemon.name)}>Catch</Button>
            )}
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  )
}