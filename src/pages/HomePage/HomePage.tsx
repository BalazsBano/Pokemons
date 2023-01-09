import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isLoadingFalse, isLoadingTrue } from "../../store/loading";
import { Button, Card, Dropdown, Form, Modal, Spinner } from "react-bootstrap";
import { getPokemonTypes, getPokemonsByTypes, getSelectedPokemonsData } from "../../api";
import { ISelectedPokemon } from "../../api/configuration";
import { IPokemon } from "../../api/getPokemonTypes/types";
import { Loading } from "../../store/loading";
import "./style.sass"
import { RootState } from "../../store/store";

export function HomePage(){
  const dispatch = useDispatch();
  const { loading }: any = useSelector((state: RootState) => state.loading.isLoading);
  const [pokemonTypes, setPokemonTypes] = useState([] as IPokemon[]);
  const [pokemonsByTypes, setPokemonsByTypes] = useState([] as IPokemon[]);
  const [filteredPokemons, setFilteredPokemons] = useState([] as IPokemon[]);
  const [filteredCheckedPokemons, setFilteredCheckedPokemons] = useState([] as IPokemon[]);
  const [selectedPokemon, setSelectedPokemon] = useState({} as ISelectedPokemon);
  const [errorMessageTypes, setErrorMessageTypes] = useState("");
  const [errorMessagePokemons, setErrorMessagePokemons] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [catchedPokemon, setCatchedPokemon] = useState(false);
  const [show, setShow] = useState(false);
  const [checkboxIsChecked, setCheckboxIsChecked] = useState(false);

  useEffect(() => {
    dispatch(isLoadingTrue())
    async function getData() {
      const pokemonTyp = await getPokemonTypes();
      if (pokemonTyp.status === 500) {
        setErrorMessageTypes(pokemonTyp.data);
        console.log(pokemonTyp.status)
      } else {
        setPokemonTypes(pokemonTyp.data)
      }
    }
    getData()
    dispatch(isLoadingFalse())
  }, []);

  async function getPokemons(url: string){
    dispatch(isLoadingTrue())
    const pokemonsByTyp = await getPokemonsByTypes(url)
    if (pokemonsByTyp.status === 500) {
      setErrorMessagePokemons(pokemonsByTyp.data);
      console.log(pokemonsByTyp.status)
    } else {
      let pokemons = []
      for (let i = 0; i < pokemonsByTyp.data.length; i++) {
        pokemons.push({...pokemonsByTyp.data[i].pokemon, catch: false})
      }
      console.log(pokemons)
      setPokemonsByTypes(pokemons)
      setFilteredPokemons(pokemons)
      setFilteredCheckedPokemons(pokemons)
    }
    dispatch(isLoadingFalse())
  }

  async function viewPokemon(url: string, name: string){
    dispatch(isLoadingTrue())
    const catched = filteredPokemons.filter((pokemon) => {
      return pokemon.name.match(name)
    })[0].catch
    setCatchedPokemon(catched)
    const pokemonData = await getSelectedPokemonsData(url)
    if (pokemonData.status === 500) {
      setErrorMessagePokemons(pokemonData.data);
      console.log(pokemonData.status)
    } else {
      let abilities = [];
      for (let i = 0; i < pokemonData.data.abilities.length; i++) {
        if (pokemonData.data.abilities[i].is_hidden === false) {
          abilities.push(pokemonData.data.abilities[i].ability.name)
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
      dispatch(isLoadingFalse())
      setSelectedPokemon(selectedPokemonData)
      setShow(true)
    }    
  }

  function filteringPokemons(inputString: string){
    setSearchInput(inputString)
    if (inputString.length > 0) {
      const filtPokemons = pokemonsByTypes.filter((pokemon) => {
        return pokemon.name.match(inputString);
      })
      setFilteredPokemons(filtPokemons)
      setFilteredCheckedPokemons(filtPokemons)
    }
  }

  function checkboxFilteredPokemons(){
    const checkFiltPokemons = pokemonsByTypes.filter((pokemon) => {
      return pokemon.catch === true;
    })
    setFilteredCheckedPokemons(checkFiltPokemons)
  }

  function catchingPokemon(name: string){
    let pokemons = pokemonsByTypes
    for (let i = 0; i < pokemons.length; i++) {
      if (pokemons[i].name === name) {
        if (pokemons[i].catch === false) {
          pokemons[i].catch = true
          setCatchedPokemon(true)
        } else {
          pokemons[i].catch = false
          setCatchedPokemon(false)
        }
      }
    }
    setPokemonsByTypes(pokemons)
  }

  function handleCheckbox(e: any) {
    if (checkboxIsChecked === false) {
      setCheckboxIsChecked(true)
      checkboxFilteredPokemons()
    } else {
      setCheckboxIsChecked(false)
      setFilteredCheckedPokemons(filteredPokemons)
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
          {!errorMessageTypes ? (
            null
          ) : (
            <h3>{errorMessageTypes}</h3>
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
        <div className="d-lg-flex flex-column row g-3 m-5">
          {!errorMessagePokemons ? (
            filteredCheckedPokemons.map((item, index) => {
              return (
                <div key={index} className="col-md-12">
                  <Card className={
                    item.catch? (
                      "card mx-3 border-success"
                      ):(
                      "card mx-3"
                      )}>
                    <Card.Body className="">
                      <Card.Title className="title fs-6">
                        Pokemon
                      </Card.Title>
                      <Card.Link href="#" onClick={() => viewPokemon(item.url, item.name)} className="subtitle fs-6 text-capitalize">
                        {item.name}
                      </Card.Link>
                    </Card.Body>
                  </Card>
                </div>
              )
            })
          ) : (
            <h3>{errorMessagePokemons}</h3>
          )}
        </div>
      </div>

      <div>
        <Modal show={show} onHide={() => setShow(false)} >
          <Modal.Header closeButton>
            <Modal.Title>{selectedPokemon.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <img className="w-100" src={selectedPokemon.image} alt="" />
            <p>Weight: {selectedPokemon.weight}</p>
            <p>Height: {selectedPokemon.height}</p>
            <p>Unhidden abilities: {selectedPokemon.abilities}</p>
          </Modal.Body>
          <Modal.Footer>
            {!catchedPokemon ? (
              <Button type="button" onClick={() => catchingPokemon(selectedPokemon.name)}>Catch</Button>
              ) : (
              <Button type="button" onClick={() => catchingPokemon(selectedPokemon.name)}>Release</Button>
              )}
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  )
}